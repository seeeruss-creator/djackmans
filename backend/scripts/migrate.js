import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function splitStatements(sql) {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(';')
    .map((s) =>
      s
        .split('\n')
        .filter((line) => !line.trim().startsWith('--'))
        .join('\n')
        .trim()
    )
    .filter((s) => s.length > 0);
}

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  const dbName = process.env.DB_NAME || 'tailoring_management';
  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.query(`USE \`${dbName}\``);

  const migrationsDir = path.join(__dirname, '../migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`Running ${file}...`);
    const statements = splitStatements(sql);
    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME' || err.errno === 1060) {
          console.log('  ↷ skipped existing column');
          continue;
        }
        if (err.code === 'ER_TABLE_EXISTS_ERROR' || err.errno === 1050) {
          console.log('  ↷ table already exists');
          continue;
        }
        console.error('  Failed statement:', statement.slice(0, 120));
        throw err;
      }
    }
    console.log(`  ✓ ${file}`);
  }

  await connection.end();
  console.log('Migrations complete.');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err.code || '', err.message);
  process.exit(1);
});
