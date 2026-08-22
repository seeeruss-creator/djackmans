# Deploy Backend on Railway → MySQL

Deploy **only the backend** (`backend/` folder). It connects to your **MySQL** service in the same Railway project.

```
Frontend (Netlify or local)  →  Railway Backend  →  Railway MySQL
```

---

## Step 1 — New service on Railway

1. Open your Railway project (the one with MySQL)
2. **New** → **GitHub Repo** → select this repository
3. Name it something like `djackman-api`

## Step 2 — Set root directory to `backend`

1. Click the new service → **Settings**
2. **Root Directory** → set to: `backend`
3. Save

Railway will use `backend/railway.toml`:
- Build: `npm install`
- Start: `npm start`

## Step 3 — Link MySQL variables

Service → **Variables** → **Add variable** → **Reference**:

| Variable | Reference |
|----------|-----------|
| `MYSQLHOST` | `${{MySQL.MYSQLHOST}}` |
| `MYSQLPORT` | `${{MySQL.MYSQLPORT}}` |
| `MYSQLUSER` | `${{MySQL.MYSQLUSER}}` |
| `MYSQLPASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
| `MYSQLDATABASE` | `${{MySQL.MYSQLDATABASE}}` |

Add manually:

| Variable | Value |
|----------|--------|
| `DB_SSL` | `false` |
| `JWT_SECRET` | any long random string |
| `JWT_EXPIRES_IN` | `24h` |

> On Railway, use **internal** `${{MySQL.*}}` vars (port **3306**).  
> Do **not** use `altaria.proxy.rlwy.net:22496` on the backend service.

## Step 4 — Deploy

Click **Deploy**. When done, copy your backend URL, e.g.:

```
https://djackman-api-production.up.railway.app
```

## Step 5 — Test backend

Open in browser:

```
https://YOUR-BACKEND-URL.up.railway.app/api/health
```

Expected:

```json
{"success":true,"message":"API is running","db":"mysql"}
```

Login test (Postman or browser devtools):

```
POST https://YOUR-BACKEND-URL.up.railway.app/api/auth/login
Body: {"username":"admin","password":"admin123"}
```

---

## Connect your frontend

If frontend is on **Netlify**, add this env var and redeploy:

```
VITE_API_URL=https://YOUR-BACKEND-URL.up.railway.app/api
```

If frontend is **local** (`npm run dev`), create `.env` in project root:

```
VITE_API_URL=https://YOUR-BACKEND-URL.up.railway.app/api
```

---

## Local backend dev (optional)

`backend/.env` with **public** proxy for DBeaver/PC:

```env
PORT=5000
MYSQLHOST=altaria.proxy.rlwy.net
MYSQLPORT=22496
MYSQLUSER=root
MYSQLPASSWORD=your_real_railway_password
MYSQLDATABASE=railway
DB_SSL=true
JWT_SECRET=djackman_local_jwt_secret_change_me
JWT_EXPIRES_IN=24h
```

---

## Login credentials

| Username | Password |
|----------|----------|
| `admin` | `admin123` |

Change password in Settings after first login.
