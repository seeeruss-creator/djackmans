import mysql from 'mysql2/promise';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl =
  process.env.NETLIFY_DATABASE_URL ||
  process.env.NETLIFY_DATABASE_URL_UNPOOLED ||
  process.env.NETLIFY_DB_URL ||
  process.env.DATABASE_URL ||
  '';

const pgUrl = /^postgres(ql)?:\/\//i.test(databaseUrl) ? databaseUrl : '';

const mysqlUrl =
  process.env.MYSQL_URL ||
  (/^mysql:\/\//i.test(databaseUrl) ? databaseUrl : '');

export const isPostgres = Boolean(pgUrl);

function parseMysqlUrl(url) {
  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, ''),
  };
}

function getMysqlConfig() {
  if (mysqlUrl) {
    return parseMysqlUrl(mysqlUrl);
  }

  const host =
    process.env.MYSQLHOST ||
    process.env.DB_HOST ||
    'localhost';

  const isRemote = host && !['localhost', '127.0.0.1', '::1'].includes(host);

  return {
    host,
    port: Number(process.env.MYSQLPORT || process.env.DB_PORT) || 3306,
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'tailoring_management',
    isRemote,
  };
}

function getMysqlSsl(config) {
  if (process.env.DB_SSL === 'false') return undefined;
  if (process.env.DB_SSL === 'true' || config.isRemote) {
    return {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true',
    };
  }
  return undefined;
}

export function isMysqlConfigured() {
  if (mysqlUrl) return true;
  return Boolean(
    process.env.MYSQLHOST ||
      process.env.MYSQL_URL ||
      process.env.DB_HOST ||
      process.env.DB_USER ||
      process.env.DB_NAME
  );
}

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
  const mysqlConfig = getMysqlConfig();
  const { isRemote, ...poolConfig } = mysqlConfig;
  mysqlPool = mysql.createPool({
    ...poolConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 15000,
    ssl: getMysqlSsl(mysqlConfig),
  });
  console.log(`Database driver: MySQL (${mysqlConfig.host}/${mysqlConfig.database})`);
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
