import mysql from 'mysql2/promise';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const pgUrl =
  process.env.NETLIFY_DATABASE_URL ||
  process.env.NETLIFY_DATABASE_URL_UNPOOLED ||
  process.env.NETLIFY_DB_URL ||
  process.env.DATABASE_URL ||
  '';

export const isPostgres = Boolean(pgUrl);

function toPgParams(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

function withReturning(sql) {
  const trimmed = sql.trim().replace(/;?\s*$/, '');
  if (/^\s*INSERT\s+/i.test(trimmed) && !/\bRETURNING\b/i.test(trimmed)) {
    return `${trimmed} RETURNING id`;
  }
  return trimmed;
}

let mysqlPool = null;
let pgSql = null;

if (isPostgres) {
  pgSql = neon(pgUrl);
  console.log('Database driver: Postgres (Netlify/Neon URL detected)');
} else {
  mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tailoring_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 8000,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
  });
  console.log('Database driver: MySQL');
}

/**
 * mysql2-compatible query helper.
 * SELECT → [rows, meta]
 * INSERT → [{ insertId, affectedRows }, meta]
 */
async function query(sql, params = []) {
  if (isPostgres) {
    const prepared = toPgParams(withReturning(sql));
    const rows = await pgSql(prepared, params);

    if (/^\s*INSERT\s+/i.test(sql)) {
      return [
        {
          insertId: rows[0]?.id ?? null,
          affectedRows: rows.length,
          rows,
        },
        null,
      ];
    }

    if (/^\s*(UPDATE|DELETE)\s+/i.test(sql)) {
      return [{ affectedRows: Array.isArray(rows) ? rows.length : 0 }, null];
    }

    return [rows, null];
  }

  return mysqlPool.query(sql, params);
}

const pool = { query, isPostgres };

export default pool;
