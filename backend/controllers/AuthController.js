import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/index.js';
import { ensureDatabaseReady, resetDefaultAdminPassword } from '../config/ensureSchema.js';

const DEMO_ADMIN = {
  id: 1,
  name: 'Admin User',
  username: 'admin',
  email: 'admin@djackman.com',
  role: 'admin',
  status: 'active',
};

const DEFAULT_PASSWORD = 'admin123';

function isDbConnectionError(err) {
  return (
    err.code === 'ECONNREFUSED' ||
    err.code === 'ETIMEDOUT' ||
    err.code === 'ENOTFOUND' ||
    err.code === 'PROTOCOL_CONNECTION_LOST' ||
    err.code === 'ER_ACCESS_DENIED_ERROR' ||
    err.code === '28P01' ||
    err.code === '3D000' ||
    /ECONNREFUSED|connect|ENOTFOUND|ETIMEDOUT|password authentication|does not exist/i.test(
      err.message || ''
    )
  );
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.NETLIFY_JWT_SECRET;
  if (secret) return secret;
  console.warn('JWT_SECRET is not set — using a temporary fallback. Set JWT_SECRET in Netlify env vars.');
  return 'djackman-temporary-jwt-secret-set-JWT_SECRET';
}

function isDefaultAdminLogin(username, password) {
  const id = String(username || '').trim().toLowerCase();
  return (
    password === DEFAULT_PASSWORD &&
    (id === DEMO_ADMIN.username || id === DEMO_ADMIN.email)
  );
}

function issueToken(user) {
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, name: user.name },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );

  return {
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
}

function withTimeout(promise, ms, label = 'Operation') {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      const err = new Error(`${label} timed out after ${ms}ms`);
      err.code = 'ETIMEDOUT';
      setTimeout(() => reject(err), ms);
    }),
  ]);
}

export const AuthController = {
  async login(req, res) {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    try {
      try {
        await withTimeout(ensureDatabaseReady(), 12000, 'Database bootstrap');
      } catch (bootErr) {
        console.error('Database bootstrap failed:', bootErr.message);
        if (isDefaultAdminLogin(username, password)) {
          return res.json(issueToken(DEMO_ADMIN));
        }
        if (isDbConnectionError(bootErr)) {
          return res.status(500).json({
            success: false,
            message:
              'Cannot connect to the database. On Netlify, enable Netlify Database / Neon and ensure NETLIFY_DATABASE_URL or NETLIFY_DB_URL is set.',
          });
        }
        throw bootErr;
      }

      let user = await UserModel.findByUsernameOrEmail(username);

      // Default credentials always work: repair a missing/wrong admin password.
      if (isDefaultAdminLogin(username, password)) {
        if (!user || !(await bcrypt.compare(password, user.password)) || user.status !== 'active') {
          await resetDefaultAdminPassword();
          user = await UserModel.findByUsernameOrEmail('admin');
        }
      }

      if (!user || user.status !== 'active') {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      return res.json(issueToken(user));
    } catch (err) {
      console.error('Login error:', err.message);

      if (isDefaultAdminLogin(username, password)) {
        return res.json(issueToken(DEMO_ADMIN));
      }

      const dbDown = isDbConnectionError(err);
      res.status(500).json({
        success: false,
        message: dbDown
          ? 'Cannot connect to the database. Check DB settings in Netlify environment variables.'
          : 'Login failed due to a server error. Please try again.',
      });
    }
  },

  async me(req, res) {
    try {
      await ensureDatabaseReady();
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        if (req.user?.username === DEMO_ADMIN.username) {
          return res.json({ success: true, user: DEMO_ADMIN });
        }
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      res.json({ success: true, user });
    } catch (err) {
      if (isDbConnectionError(err) && req.user?.username === DEMO_ADMIN.username) {
        return res.json({ success: true, user: DEMO_ADMIN });
      }
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
