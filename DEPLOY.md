# Deploying Ganesh Spices

## 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run SQL files in order from `server/sql/` in the SQL Editor.
3. Confirm the `product-images` storage bucket is public.
4. Copy **Project URL** and **service role key** (Settings → API).

Default admin after seed: **admin** / **admin123**

## 2. API on Render

1. Connect this repo to [Render](https://render.com).
2. Create a **Web Service** with these settings (must match exactly):

   | Setting | Value |
   |---------|--------|
   | **Root Directory** | *(leave empty)* |
   | **Build Command** | `npm ci --prefix server` |
   | **Start Command** | `npm start --prefix server` |
   | **NODE_VERSION** (env) | `20` |

   **Important:** If your deploy log shows paths like `/opt/render/project/src/server/...`, you must use the table above (repo root + `--prefix server`). Do **not** set Root Directory to `server` and also use `--prefix server` — pick one layout only.

   Alternative (only if Root Directory is `server`):

   | **Root Directory** | `server` |
   | **Build Command** | `npm ci` |
   | **Start Command** | `npm start` |
3. Set environment variables:

| Variable | Example |
|----------|---------|
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service role secret |
| `JWT_SECRET` | long random string |
| `CORS_ORIGINS` | `https://your-app.vercel.app,http://localhost:5173` |

4. Deploy and note the URL (e.g. `https://ganesh-spices-api.onrender.com`).

## 3. Frontend on Vercel

1. Import the repo at [vercel.com](https://vercel.com).
2. Framework preset: **Vite**.
3. Set environment variable:

| Variable | Value |
|----------|--------|
| `VITE_API_URL` | Your Render API URL (no trailing slash) |

4. Deploy.

## Local development

```bash
# Terminal 1 — API
cd server && cp .env.example .env   # fill in Supabase + JWT
npm install && npm run dev

# Terminal 2 — frontend
cp .env.example .env
npm install && npm run dev
```

Frontend: http://localhost:5173 · API: http://localhost:3001
