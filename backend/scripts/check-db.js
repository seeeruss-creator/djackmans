import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const root = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(root, '.env') });

async function main() {
  console.log('Connecting to', process.env.DB_HOST, process.env.DB_NAME, 'as', process.env.DB_USER);
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    console.log('MySQL connected OK');
    const [dbs] = await conn.query("SHOW DATABASES LIKE 'tailoring_management'");
    console.log('DB exists:', dbs.length > 0);
    if (dbs.length) {
      await conn.query('USE tailoring_management');
      const [tables] = await conn.query('SHOW TABLES');
      console.log('Tables:', tables.map((t) => Object.values(t)[0]).join(', '));
      try {
        const [users] = await conn.query('SELECT id, username, role, status FROM users');
        console.log('Users:', JSON.stringify(users));
      } catch (e) {
        console.log('Users table error:', e.message);
      }
    }
    await conn.end();
  } catch (e) {
    console.log('DB ERROR:', e.code, e.message);
  }
}

main();
