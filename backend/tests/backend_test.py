"""Backend API tests for Synergy Petroleum 3D-motion site."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://synergy-3d-motion.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@synergypetroleum.com"
ADMIN_PASSWORD = "Synergy2026!"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Admin login failed: {r.status_code} {r.text}")
    data = r.json()
    assert "token" in data
    return data["token"]


@pytest.fixture()
def auth(token):
    return {"Authorization": f"Bearer {token}"}


# ---- Auth ----
class TestAuth:
    def test_login_success(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        d = r.json()
        assert d["email"] == ADMIN_EMAIL
        assert d["role"] == "admin"
        assert isinstance(d["token"], str) and len(d["token"]) > 20

    def test_login_wrong_password(self, session):
        r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "WrongPass_" + uuid.uuid4().hex[:6]})
        assert r.status_code == 401

    def test_me_with_bearer(self, session, auth):
        r = requests.get(f"{API}/auth/me", headers=auth)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_me_unauth(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401


# ---- Content ----
class TestContent:
    def test_list_content(self):
        r = requests.get(f"{API}/content")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_get_home(self):
        r = requests.get(f"{API}/content/home")
        assert r.status_code == 200
        assert r.json()["slug"] == "home"

    def test_update_home_requires_auth(self):
        r = requests.put(f"{API}/content/home", json={"slug": "home", "title": "X", "sections": {}})
        assert r.status_code == 401

    def test_update_home(self, auth):
        original = requests.get(f"{API}/content/home").json()
        new_title = f"Home {uuid.uuid4().hex[:6]}"
        payload = {"slug": "home", "title": new_title, "sections": original.get("sections", {})}
        r = requests.put(f"{API}/content/home", json=payload, headers=auth)
        assert r.status_code == 200
        assert r.json()["title"] == new_title
        # revert
        requests.put(f"{API}/content/home", json={"slug": "home", "title": original["title"], "sections": original.get("sections", {})}, headers=auth)


# ---- Locations CRUD ----
class TestLocations:
    def test_list_locations(self):
        r = requests.get(f"{API}/locations")
        assert r.status_code == 200
        locs = r.json()
        assert isinstance(locs, list)
        assert len(locs) >= 6  # 6 seeded

    def test_crud_location(self, auth):
        payload = {"name": "TEST_Loc", "address": "1 Test St", "city": "Testville", "lat": 38.5, "lng": -121.5, "type": "Gas Station", "description": "test"}
        r = requests.post(f"{API}/locations", json=payload, headers=auth)
        assert r.status_code == 200
        loc = r.json()
        lid = loc["id"]
        # verify persisted
        found = [x for x in requests.get(f"{API}/locations").json() if x["id"] == lid]
        assert found and found[0]["name"] == "TEST_Loc"
        # update
        payload["name"] = "TEST_Loc_Updated"
        r2 = requests.put(f"{API}/locations/{lid}", json=payload, headers=auth)
        assert r2.status_code == 200 and r2.json()["name"] == "TEST_Loc_Updated"
        # delete
        r3 = requests.delete(f"{API}/locations/{lid}", headers=auth)
        assert r3.status_code == 200


# ---- Brands / Services ----
class TestBrandsServices:
    def test_list_brands(self):
        assert requests.get(f"{API}/brands").status_code == 200

    def test_list_services(self):
        assert requests.get(f"{API}/services").status_code == 200

    def test_brand_crud(self, auth):
        r = requests.post(f"{API}/brands", json={"name": "TEST_Brand", "tagline": "t", "description": "d", "order": 99}, headers=auth)
        assert r.status_code == 200
        bid = r.json()["id"]
        assert requests.put(f"{API}/brands/{bid}", json={"name": "TEST_Brand2", "tagline": "", "description": "", "order": 99}, headers=auth).status_code == 200
        assert requests.delete(f"{API}/brands/{bid}", headers=auth).status_code == 200

    def test_service_crud(self, auth):
        r = requests.post(f"{API}/services", json={"name": "TEST_Svc", "description": "d", "order": 99}, headers=auth)
        assert r.status_code == 200
        sid = r.json()["id"]
        assert requests.delete(f"{API}/services/{sid}", headers=auth).status_code == 200


# ---- Contact + Submissions ----
class TestContact:
    def test_submit_contact_public(self):
        payload = {"name": "TEST_User", "email": "test@example.com", "message": "hello TEST", "phone": "", "company": ""}
        r = requests.post(f"{API}/contact", json=payload)
        assert r.status_code == 200
        assert r.json()["ok"] is True

    def test_submissions_require_auth(self):
        assert requests.get(f"{API}/contact/submissions").status_code == 401

    def test_submissions_list_mark_delete(self, auth):
        # create a fresh one
        payload = {"name": "TEST_Inbox", "email": "inbox@example.com", "message": "TEST inbox msg"}
        create = requests.post(f"{API}/contact", json=payload)
        sid = create.json()["id"]
        r = requests.get(f"{API}/contact/submissions", headers=auth)
        assert r.status_code == 200
        assert any(s["id"] == sid for s in r.json())
        assert requests.put(f"{API}/contact/submissions/{sid}/read", headers=auth).status_code == 200
        assert requests.delete(f"{API}/contact/submissions/{sid}", headers=auth).status_code == 200


# ---- Settings ----
class TestSettings:
    def test_get_settings(self):
        assert requests.get(f"{API}/settings").status_code == 200

    def test_update_settings_requires_auth(self):
        r = requests.put(f"{API}/settings", json={"phone": "1", "email": "a@b.co", "address": "x"})
        assert r.status_code == 401

    def test_update_settings(self, auth):
        original = requests.get(f"{API}/settings").json()
        payload = {"phone": "555-TEST", "email": "test@syn.com", "address": "1 addr", "hours": "9-5"}
        r = requests.put(f"{API}/settings", json=payload, headers=auth)
        assert r.status_code == 200
        assert r.json()["phone"] == "555-TEST"
        # revert if had prior
        if original and "phone" in original:
            requests.put(f"{API}/settings", json={k: original.get(k, "") for k in ["phone", "email", "address", "hours"]}, headers=auth)
