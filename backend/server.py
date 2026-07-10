from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, APIRouter, Request, Response, HTTPException, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(days=1), "type": "access"}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------- Models ----------
class LoginInput(BaseModel):
    email: str
    password: str


class PageContent(BaseModel):
    slug: str
    title: str
    sections: Dict[str, Any] = {}


class LocationInput(BaseModel):
    name: str
    address: str = ""
    city: str = ""
    lat: float
    lng: float
    type: str = "Gas Station"
    description: str = ""


class BrandInput(BaseModel):
    name: str
    tagline: str = ""
    description: str = ""
    image: str = ""
    order: int = 0


class ServiceInput(BaseModel):
    name: str
    description: str = ""
    image: str = ""
    icon: str = ""
    order: int = 0


class ContactSubmission(BaseModel):
    name: str
    email: str
    phone: str = ""
    company: str = ""
    message: str


class SettingsInput(BaseModel):
    phone: str
    email: str
    address: str
    hours: str = ""


# ---------- Auth ----------
@api_router.post("/auth/login")
async def login(data: LoginInput, request: Request, response: Response):
    email = data.email.lower().strip()
    identifier = f"{request.client.host}:{email}"
    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("count", 0) >= 5:
        locked_at = datetime.fromisoformat(attempt["last_attempt"])
        if datetime.now(timezone.utc) - locked_at < timedelta(minutes=15):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
        await db.login_attempts.delete_one({"identifier": identifier})
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": identifier},
            {"$inc": {"count": 1}, "$set": {"last_attempt": datetime.now(timezone.utc).isoformat()}},
            upsert=True,
        )
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await db.login_attempts.delete_one({"identifier": identifier})
    token = create_access_token(user["id"], email)
    response.set_cookie(key="access_token", value=token, httponly=True, secure=True, samesite="none", max_age=86400, path="/")
    return {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin"), "token": token}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


# ---------- Content ----------
@api_router.get("/content")
async def get_all_content():
    return await db.pages.find({}, {"_id": 0}).to_list(100)


@api_router.get("/content/{slug}")
async def get_content(slug: str):
    page = await db.pages.find_one({"slug": slug}, {"_id": 0})
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    return page


@api_router.put("/content/{slug}")
async def update_content(slug: str, data: PageContent, user: dict = Depends(get_current_user)):
    await db.pages.update_one({"slug": slug}, {"$set": {"title": data.title, "sections": data.sections}}, upsert=True)
    return await db.pages.find_one({"slug": slug}, {"_id": 0})


# ---------- Locations ----------
@api_router.get("/locations")
async def get_locations():
    return await db.locations.find({}, {"_id": 0}).to_list(200)


@api_router.post("/locations")
async def create_location(data: LocationInput, user: dict = Depends(get_current_user)):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    await db.locations.insert_one({**doc})
    return doc


@api_router.put("/locations/{loc_id}")
async def update_location(loc_id: str, data: LocationInput, user: dict = Depends(get_current_user)):
    result = await db.locations.update_one({"id": loc_id}, {"$set": data.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Location not found")
    return await db.locations.find_one({"id": loc_id}, {"_id": 0})


@api_router.delete("/locations/{loc_id}")
async def delete_location(loc_id: str, user: dict = Depends(get_current_user)):
    await db.locations.delete_one({"id": loc_id})
    return {"ok": True}


# ---------- Brands ----------
@api_router.get("/brands")
async def get_brands():
    return await db.brands.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@api_router.post("/brands")
async def create_brand(data: BrandInput, user: dict = Depends(get_current_user)):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    await db.brands.insert_one({**doc})
    return doc


@api_router.put("/brands/{brand_id}")
async def update_brand(brand_id: str, data: BrandInput, user: dict = Depends(get_current_user)):
    result = await db.brands.update_one({"id": brand_id}, {"$set": data.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Brand not found")
    return await db.brands.find_one({"id": brand_id}, {"_id": 0})


@api_router.delete("/brands/{brand_id}")
async def delete_brand(brand_id: str, user: dict = Depends(get_current_user)):
    await db.brands.delete_one({"id": brand_id})
    return {"ok": True}


# ---------- Services ----------
@api_router.get("/services")
async def get_services():
    return await db.services.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@api_router.post("/services")
async def create_service(data: ServiceInput, user: dict = Depends(get_current_user)):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    await db.services.insert_one({**doc})
    return doc


@api_router.put("/services/{service_id}")
async def update_service(service_id: str, data: ServiceInput, user: dict = Depends(get_current_user)):
    result = await db.services.update_one({"id": service_id}, {"$set": data.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return await db.services.find_one({"id": service_id}, {"_id": 0})


@api_router.delete("/services/{service_id}")
async def delete_service(service_id: str, user: dict = Depends(get_current_user)):
    await db.services.delete_one({"id": service_id})
    return {"ok": True}


# ---------- Settings ----------
@api_router.get("/settings")
async def get_settings():
    settings = await db.settings.find_one({"key": "contact_info"}, {"_id": 0})
    return settings or {}


@api_router.put("/settings")
async def update_settings(data: SettingsInput, user: dict = Depends(get_current_user)):
    await db.settings.update_one({"key": "contact_info"}, {"$set": data.model_dump()}, upsert=True)
    return await db.settings.find_one({"key": "contact_info"}, {"_id": 0})


# ---------- Contact ----------
def send_notification_email(submission: dict):
    api_key = os.environ.get("SENDGRID_API_KEY", "")
    sender = os.environ.get("SENDER_EMAIL", "")
    notify = os.environ.get("CONTACT_NOTIFY_EMAIL", "")
    if not api_key or not sender or not notify:
        logger.info("SendGrid not configured; skipping email notification")
        return
    try:
        from sendgrid import SendGridAPIClient
        from sendgrid.helpers.mail import Mail
        body = f"Name: {submission['name']}\nEmail: {submission['email']}\nPhone: {submission.get('phone','')}\nCompany: {submission.get('company','')}\n\nMessage:\n{submission['message']}"
        message = Mail(from_email=sender, to_emails=notify,
                       subject=f"New contact form submission from {submission['name']}",
                       plain_text_content=body)
        SendGridAPIClient(api_key).send(message)
    except Exception as e:
        logger.error(f"SendGrid error: {e}")


@api_router.post("/contact")
async def submit_contact(data: ContactSubmission):
    doc = data.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    doc["read"] = False
    await db.submissions.insert_one({**doc})
    send_notification_email(doc)
    return {"ok": True, "id": doc["id"]}


@api_router.get("/contact/submissions")
async def get_submissions(user: dict = Depends(get_current_user)):
    return await db.submissions.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@api_router.put("/contact/submissions/{sub_id}/read")
async def mark_read(sub_id: str, user: dict = Depends(get_current_user)):
    await db.submissions.update_one({"id": sub_id}, {"$set": {"read": True}})
    return {"ok": True}


@api_router.delete("/contact/submissions/{sub_id}")
async def delete_submission(sub_id: str, user: dict = Depends(get_current_user)):
    await db.submissions.delete_one({"id": sub_id})
    return {"ok": True}


app.include_router(api_router)

cors_origins = os.environ.get('CORS_ORIGINS', '*')
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins.split(',') if cors_origins != '*' else ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")
    admin_email = os.environ["ADMIN_EMAIL"].lower()
    admin_password = os.environ["ADMIN_PASSWORD"]
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()), "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin", "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
    from seed import seed_data
    await seed_data(db)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
