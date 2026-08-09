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
- **Backend:** Node.js, Express, MySQL2, JWT, bcryptjs
- **Fonts:** Playfair Display (serif display), Inter (sans)

## Deployment Notes (Netlify)

This repo deploys **both the React frontend and Express API on one Netlify site**:

- Frontend is built to `dist/`
- Backend runs as a Netlify Function at `/.netlify/functions/api`
- `/api/*` requests are rewritten to that function via `netlify.toml`

### Required Netlify environment variables

In **Site settings → Environment variables**, add:

| Variable | Example | Notes |
|----------|---------|-------|
| `JWT_SECRET` | `a_long_random_string` | **Required** for login |
| `DB_HOST` | your-db-host.com | Remote MySQL host |
| `DB_PORT` | `3306` | Optional |
| `DB_USER` | `root` | MySQL user |
| `DB_PASSWORD` | `yourpassword` | MySQL password |
| `DB_NAME` | `tailoring_management` | Database name |
| `DB_SSL` | `true` | Set for most cloud MySQL hosts |

Netlify cannot run a local MySQL server. Use a hosted MySQL provider (Railway, PlanetScale, Aiven, etc.), run migrations/seeds against that database, then set the variables above.

If the database is unreachable, login still works with the demo account **`admin` / `admin123`** as long as `JWT_SECRET` is set.

After changing environment variables, trigger a new deploy in Netlify.
