# CivicConnect — frontend + backend, run together

```
CivicConnect/
├── F11/        React + Vite app: landing page + Citizen, Authority and Worker portals
└── Backend/    Express + PostgreSQL API (JWT auth, complaints, photo uploads)
```

The frontend now talks to the backend for **sign-up / login, profiles, complaints,
assigning workers, worker tasks, work photos and notifications**. Nothing is stored in
`localStorage` except the login token and a cached copy of the signed-in user's profile.

## 1. One-time setup

You need Node 20+ and PostgreSQL (Docker is the easiest way).

```bash
# from this folder
npm run setup          # installs Backend/ and F11/ (and the root helper)
npm install            # installs "concurrently" for the one-command start

npm run db:up          # starts PostgreSQL in Docker  (skip if you have your own Postgres)
npm run db:init        # creates the tables and the demo data
```

Using your own PostgreSQL instead of Docker: create a database called `civicconnect`,
then edit `Backend/.env` → `DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/civicconnect`.

## 2. Run both

```bash
npm run dev
```

| What | URL |
| --- | --- |
| Website (landing page + portals) | http://localhost:5173 |
| API health check | http://localhost:4000/api/health |

Or in two terminals: `npm run dev:api` and `npm run dev:web`.

Config files (already created for you):

- `Backend/.env`  — `PORT=4000`, `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN` (must include the web URL)
- `F11/.env`      — `VITE_API_URL=http://localhost:4000`

## 3. Demo accounts (created by `npm run db:init`)

| Portal | Sign in with | Password |
| --- | --- | --- |
| Citizen | `citizen@civicconnect.com` or `9876543210` | `citizen@1234` |
| Authority | Employee ID `AUTH-001` | `authority@1234` |
| Worker | Username `wk-101` … `wk-112` | `worker@1234` |

New sign-ups work in every portal. **Passwords must be at least 8 characters.**

## 4. Quick end-to-end test

1. Citizen → *Report an issue* (add a photo) → note the complaint ID.
2. Authority → *Complaints* → open it → pick a worker (e.g. Roads: `WK-104`) → *Assign*.
3. Worker (`wk-104`) → *Assigned Tasks* → *Start* → add a progress photo → add a completion photo → *Complete*.
4. Citizen → *Track* the complaint: status, worker and photos are all there. Authority → *Notifications* shows each step.

## Notes

- Each portal keeps its **own** login, so you can be signed in as all three in one browser.
- Uploaded photos live in `Backend/uploads/` and are served by the API.
- Production: set a long random `JWT_SECRET`, set `CORS_ORIGIN` to your site's URL, and build the web app
  with `VITE_API_URL` pointing at the deployed API (`npm --prefix F11 run build`).
