import bcrypt from 'bcryptjs';
import pool, { isPostgres } from './db.js';

let readyPromise = null;

const PG_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NULL,
    address TEXT NULL,
    notes TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'clerk',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS rent_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    garment_name VARCHAR(150) NOT NULL,
    size VARCHAR(20) NULL,
    rental_start_date DATE NOT NULL,
    rental_end_date DATE NOT NULL,
    rental_duration INT NULL,
    deposit DECIMAL(10,2) DEFAULT 0.00,
    price DECIMAL(10,2) NOT NULL,
    brand VARCHAR(100) NULL,
    color VARCHAR(100) NULL,
    fabric VARCHAR(100) NULL,
    quantity INT NOT NULL DEFAULT 1,
    description TEXT NULL,
    special_instructions TEXT NULL,
    order_date DATE NULL,
    due_date DATE NULL,
    additional_charges DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NULL,
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid',
    delivery_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    status VARCHAR(50) NOT NULL DEFAULT 'received',
    notes TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS customization_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    garment_type VARCHAR(100) NOT NULL,
    fabric_type VARCHAR(100) NULL,
    measurements TEXT NULL,
    design_description TEXT NULL,
    estimated_completion_date DATE NULL,
    price DECIMAL(10,2) NULL,
    color VARCHAR(100) NULL,
    style VARCHAR(100) NULL,
    quantity INT NOT NULL DEFAULT 1,
    embellishments TEXT NULL,
    special_instructions TEXT NULL,
    order_date DATE NULL,
    due_date DATE NULL,
    additional_charges DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NULL,
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid',
    delivery_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    status VARCHAR(50) NOT NULL DEFAULT 'received',
    notes TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS repair_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    garment_type VARCHAR(100) NOT NULL,
    damage_description TEXT NOT NULL,
    damage_level VARCHAR(50) NULL,
    size VARCHAR(20) NULL,
    estimated_completion_date DATE NULL,
    price DECIMAL(10,2) NULL,
    repair_type VARCHAR(150) NULL,
    required_work TEXT NULL,
    quantity INT NOT NULL DEFAULT 1,
    special_instructions TEXT NULL,
    order_date DATE NULL,
    due_date DATE NULL,
    additional_charges DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NULL,
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid',
    delivery_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    status VARCHAR(50) NOT NULL DEFAULT 'received',
    notes TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS drycleaning_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    garment_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NULL,
    quantity INT NOT NULL DEFAULT 1,
    price_per_item DECIMAL(10,2) NULL,
    total_price DECIMAL(10,2) NULL,
    pickup_date DATE NULL,
    cleaning_instructions TEXT NULL,
    stain_description TEXT NULL,
    special_instructions TEXT NULL,
    order_date DATE NULL,
    due_date DATE NULL,
    additional_charges DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10,2) NULL,
    amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    balance DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid',
    delivery_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    status VARCHAR(50) NOT NULL DEFAULT 'received',
    notes TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
];

async function ensureAdminUser() {
  const [existing] = await pool.query('SELECT id FROM users WHERE username = ? LIMIT 1', ['admin']);
  if (existing.length > 0) return;

  const hashed = await bcrypt.hash('admin123', 10);
  await pool.query(
    `INSERT INTO users (name, username, email, password, role, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['Admin User', 'admin', 'admin@djackman.com', hashed, 'admin', 'active']
  );
  console.log('Bootstrapped default admin user (admin / admin123)');
}

/** Reset or create the default admin so admin / admin123 always works. */
export async function resetDefaultAdminPassword() {
  const hashed = await bcrypt.hash('admin123', 10);
  const [existing] = await pool.query('SELECT id FROM users WHERE username = ? LIMIT 1', ['admin']);

  if (existing.length === 0) {
    await pool.query(
      `INSERT INTO users (name, username, email, password, role, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['Admin User', 'admin', 'admin@djackman.com', hashed, 'admin', 'active']
    );
    return;
  }

  await pool.query(
    `UPDATE users SET password = ?, status = 'active', role = 'admin' WHERE username = ?`,
    [hashed, 'admin']
  );
}

async function runEnsure() {
  if (isPostgres) {
    for (const statement of PG_STATEMENTS) {
      await pool.query(statement);
    }
  } else {
    // MySQL: best-effort notes column for older schemas
    try {
      await pool.query('ALTER TABLE customers ADD COLUMN notes TEXT NULL');
    } catch {
      /* column may already exist */
    }
  }

  await ensureAdminUser();
}

/**
 * Creates tables (Postgres) and ensures admin/admin123 exists.
 * Safe to call on every request; runs once per cold start.
 */
export function ensureDatabaseReady() {
  if (!readyPromise) {
    readyPromise = runEnsure().catch((err) => {
      readyPromise = null;
      throw err;
    });
  }
  return readyPromise;
}
