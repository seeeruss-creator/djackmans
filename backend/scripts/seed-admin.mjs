/**
 * Create or reset the default admin user.
 * Uses backend/.env (local XAMPP or Railway MySQL).
 *
 * Usage (from backend folder):
 *   node scripts/seed-admin.mjs
 *   node scripts/seed-admin.mjs --password myNewPassword
 */
import bcrypt from 'bcryptjs';
import pool, { isPostgres } from '../config/db.js';

const password = process.argv.includes('--password')
  ? process.argv[process.argv.indexOf('--password') + 1]
  : 'admin123';

if (!password || password.length < 6) {
  console.error('Password must be at least 6 characters.');
  process.exit(1);
}

async function main() {
  if (isPostgres) {
    console.error('This script is for MySQL. Postgres admin is seeded on app startup.');
    process.exit(1);
  }

  const [tables] = await pool.query('SHOW TABLES LIKE ?', ['users']);
  if (!tables.length) {
    console.error('Table "users" not found. Run the DJACKMAN_DB schema SQL in DBeaver first.');
    process.exit(1);
  }

  const [users] = await pool.query(
    'SELECT id, username, email, role, status FROM users ORDER BY id'
  );
  console.log('Existing users:', users);

  const hash = await bcrypt.hash(password, 10);
  const [existing] = await pool.query('SELECT id FROM users WHERE username = ? LIMIT 1', ['admin']);

  if (existing.length) {
    await pool.query(
      'UPDATE users SET password = ?, status = ?, role = ? WHERE username = ?',
      [hash, 'active', 'admin', 'admin']
    );
    console.log('Updated admin password.');
  } else {
    await pool.query(
      `INSERT INTO users (name, username, email, password, role, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['Admin User', 'admin', 'admin@djackman.com', hash, 'admin', 'active']
    );
    console.log('Created admin user.');
  }

  console.log('Login with: admin /', password);
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  if (err.code === 'ECONNREFUSED') {
    console.error('Cannot reach MySQL. For Railway: copy MYSQLHOST, MYSQLUSER, etc. into backend/.env');
  }
  process.exit(1);
});
