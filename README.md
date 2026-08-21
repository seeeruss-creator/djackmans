# D'Jackman Tailor Deluxe — Management System

Public marketing site + staff admin system built with React + Vite + Tailwind on the frontend, and Node.js + Express + MySQL on the backend.

---

## Prerequisites

- Node.js 18+
- MySQL 8+
- npm

---

## Setup

### 1. Add your images

Copy your image files into:

```
public/images/
  tailorbackground.jpg
  logo.png
  favicon.png
  rental.jpg
  rent.jpg
  customize.jpg
  custom.jpg
  repair.jpg
  dry.jpg
  gown.jpg
  blacktuxedo.jpg
  barong.jpg
  blackdress.jpg
  beige.jpg
  filipiniana.jpg
  graysuit.jpg
  royalblue.jpg
```

Also copy them into `src/assets/images/` (used by components that import directly).

### 2. Install frontend dependencies

Open a terminal, navigate to this folder, and run:

```
npm install
```

### 3. Configure the backend

```
cd backend
copy .env.example .env
```

Edit `backend/.env` and fill in your MySQL credentials:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=tailoring_management
JWT_SECRET=any_long_random_string
```

Install backend dependencies:

```
npm install
```

### 4. Create the database

In MySQL:

```sql
CREATE DATABASE tailoring_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Run migrations

```
cd backend
node scripts/migrate.js
```

### 6. Seed the database

```
node seeds/seed.js
```

This creates:
- Default admin user: **username** `admin` / **password** `admin123`
- 3 sample customers
- 1 sample order in each module

### 7. Start the backend

```
cd backend
npm run dev
```

Backend runs on `http://localhost:5000`.

### 8. Start the frontend

Open a new terminal in the project root:

```
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## Default Credentials

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | `admin`  | `admin123` |

**Change this password immediately after first login.**

---

## Routes

### Public site
| Path | Page |
|------|------|
| `/` | Home |
| `/appointment` | Appointment info |
| `/rental` | Rental service |
| `/customize` | Customization service |
| `/repair` | Repair service |
| `/dry-cleaning` | Dry cleaning service |
| `/login` | Staff login |

### Admin (requires login)
| Path | Page |
|------|------|
| `/dashboard` | Dashboard — order counts only |
| `/rent-orders` | Rent order management |
| `/customization-orders` | Customization order management |
| `/repair-orders` | Repair order management |
| `/dry-cleaning-orders` | Dry cleaning order management |
| `/customers` | Customer management |
| `/users` | User management (admin only) |

---

## Order Number Rules

- Manually entered by staff — never auto-generated
- Must be globally unique across all four order tables
- Maximum 50 characters, trimmed
- Duplicate error message: *"Order number already exists. Please enter a different unique number."*

---

## Tech Stack

- **Frontend:** React 19, Vite 8, React Router 7, Tailwind CSS 3, Axios
- **Backend:** Node.js, Express, MySQL2 or Postgres (Netlify/Neon), JWT, bcryptjs
- **Fonts:** Playfair Display (serif display), Inter (sans)

## Deployment Notes (Netlify)

This repo deploys **both the React frontend and Express API on one Netlify site**:

- Frontend is built to `dist/`
- Backend runs as a Netlify Function at `/.netlify/functions/api`
- `/api/*` requests are rewritten to that function via `netlify.toml`
- On first API request the app creates tables (Postgres) and ensures admin `admin` / `admin123` exists

### Required Netlify environment variables

In **Site settings → Environment variables**, add:

| Variable | Example | Notes |
|----------|---------|-------|
| `JWT_SECRET` | `a_long_random_string` | Recommended for login tokens |
| `NETLIFY_DATABASE_URL` or `NETLIFY_DB_URL` | `postgresql://...` | **Preferred** — Netlify Postgres / Neon (auto-set when DB is enabled) |

If you use an external MySQL database instead, set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (and usually `DB_SSL=true`). Do not mix MySQL and Postgres vars for the same deploy — a Postgres URL takes priority.

Login credentials after deploy: **`admin` / `admin123`**

After changing environment variables, trigger a new deploy in Netlify.
