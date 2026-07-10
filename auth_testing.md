# Auth Testing Playbook

## Credentials
- Admin: admin@synergypetroleum.com / Synergy2026!

## API Testing
```
curl -c cookies.txt -X POST http://localhost:8001/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@synergypetroleum.com","password":"Synergy2026!"}'
curl -b cookies.txt http://localhost:8001/api/auth/me
```
Login returns user object + token, sets access_token cookie. Bearer token auth also supported (frontend stores token in localStorage as sp_token).

## Brute force
5 failed attempts = 15 min lockout (429).
