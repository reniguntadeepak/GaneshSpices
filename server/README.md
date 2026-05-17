# Ganesh Spices API

Node.js + Express API backed by Supabase (PostgreSQL + Storage).

## Setup

1. Create a [Supabase](https://supabase.com) project.
2. In the SQL Editor, run in order:
   - `sql/001_schema.sql`
   - `sql/002_seed.sql` (admin: `admin` / `admin123`)
   - `sql/003_storage.sql`
3. Copy `.env.example` to `.env` and fill in:
   - `SUPABASE_URL` — Project Settings → API
   - `SUPABASE_SERVICE_ROLE_KEY` — service role (server only, never expose to React)
   - `JWT_SECRET` — random string
4. Install and run:

```bash
cd server
npm install
npm run dev
```

Generate a bcrypt hash for custom passwords: `npm run hash -- yourpassword`

## Deploy (Render)

- Root directory: `server`
- Build: `npm install`
- Start: `npm start`
- Set env vars from `.env.example`
- Health check: `/api/health`
