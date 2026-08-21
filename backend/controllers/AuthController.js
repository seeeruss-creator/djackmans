import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/index.js';
import { ensureDatabaseReady } from '../config/ensureSchema.js';
import { getJwtSecret } from '../middleware/auth.js';

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
        if (isDbConnectionError(bootErr)) {
          return res.status(500).json({
            success: false,
            message: 'Cannot connect to the database. Check your database settings.',
          });
        }
        throw bootErr;
      }

      const user = await UserModel.findByUsernameOrEmail(username);
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
      const dbDown = isDbConnectionError(err);
      res.status(500).json({
        success: false,
        message: dbDown
          ? 'Cannot connect to the database. Check your database settings.'
          : 'Login failed due to a server error. Please try again.',
      });
    }
  },

  async me(req, res) {
    try {
      await ensureDatabaseReady();
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body || {};
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password and new password are required.',
        });
      }
      if (String(newPassword).length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters.',
        });
      }
      if (currentPassword === newPassword) {
        return res.status(400).json({
          success: false,
          message: 'New password must be different from the current password.',
        });
      }

      await ensureDatabaseReady();
      const user = await UserModel.findByUsername(req.user.username);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }

      const hashed = await bcrypt.hash(newPassword, 10);
      await UserModel.update(user.id, { password: hashed });

      res.json({
        success: true,
        message: 'Password updated successfully. Use your new password next time you sign in.',
      });
    } catch (err) {
      console.error('Change password error:', err.message);
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
