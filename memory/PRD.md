# PRD — Synergy Petroleum 3D Website Rebuild

## Original Problem Statement
Modern, 3D-styled web rebuild of casynergy.com (Synergy Petroleum — Northern California fuel distributor & gas station operator) with rich motion animations, animated imagery, smooth page transitions, and an admin dashboard to manage all content.

## User Choices
- Email: SendGrid (key not yet provided — email skipped gracefully, submissions saved to DB)
- Map: Leaflet + OpenStreetMap (CartoDB dark tiles)
- Admin: seeded default account (admin@synergypetroleum.com / Synergy2026!)
- Content: pulled from casynergy.com + themed stock imagery; exact images to be swapped later via admin (image URL fields)

## Architecture
- Frontend: React 19 (CRA/craco), TailwindCSS, Framer Motion, React Three Fiber + drei (3D hero), Lenis smooth scroll, react-leaflet, @phosphor-icons, sonner
- Backend: FastAPI + Motor (MongoDB), JWT auth (PyJWT + bcrypt, httpOnly cookie + Bearer fallback), brute-force lockout, SendGrid (optional)
- DB collections: users, pages (slug + sections dict), locations, brands, services, submissions, settings, login_attempts
- Seed: /app/backend/seed.py (7 pages, 6 locations, 4 brands, 6 services, contact settings)

## User Personas
- Public visitor: wholesale fuel buyers, station operators, fleet managers
- Admin: internal team managing content

## Implemented (June 2026 — MVP)
- Public pages: Home (3D hero, strengths bento, pillars, CTA), Brands, Services, Maintenance, Locations (Leaflet map + cards), Why Us, Company, Contact (form)
- Motion: page transitions (AnimatePresence), scroll reveals/stagger, parallax hero, Ken Burns, tilt images, magnetic buttons, Lenis smooth scroll
- Admin panel (/admin): JWT login, dashboard stats, page-content editor (recursive field editor per section), locations CRUD, brands CRUD, services CRUD, submissions inbox (read/delete), contact info settings, logout
- Contact form → DB + SendGrid notification (when key configured)
- Tested: iteration_1 — 100% backend (20 tests) & frontend pass

## Backlog
- P0: SendGrid API key from user (set SENDGRID_API_KEY, SENDER_EMAIL, CONTACT_NOTIFY_EMAIL in backend/.env)
- P1: Object-storage image uploads in admin (currently image URL fields)
- P1: SEO meta tags per page (currently document.title only), sitemap
- P2: Password change from admin UI
- P2: Blog/News, careers page, customer portal, live fuel price dashboard (future ideas from user)

## Key Files
- backend/server.py, backend/seed.py
- frontend/src/App.js (routes), pages/, pages/admin/, components/Hero3D.jsx, components/motion/
- /app/memory/test_credentials.md, /app/auth_testing.md
