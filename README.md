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

## Deployment Notes

If you deploy the frontend on Netlify, you must also deploy the backend separately and set `VITE_API_URL` in Netlify to the live API URL.

Netlify also needs an SPA redirect so routes like `/admin/customers` and `/admin/reports` load correctly on refresh. That is handled by `netlify.toml` in this repo.
