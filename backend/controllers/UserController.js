import bcrypt from 'bcryptjs';
import { UserModel } from '../models/index.js';

export const UserController = {
  async list(req, res) {
    try {
      const users = await UserModel.findAll();
      res.json({ success: true, data: users });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async create(req, res) {
    try {
      const { name, username, email, password, role, status } = req.body;
      const errors = {};
      if (!name?.trim()) errors.name = 'Name is required.';
      if (!username?.trim()) errors.username = 'Username is required.';
      if (!email?.trim()) errors.email = 'Email is required.';
      if (!password) errors.password = 'Password is required.';
      if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Validation failed.', errors });

      const hashed = await bcrypt.hash(password, 10);
      const user = await UserModel.create({ name, username, email, password: hashed, role, status });
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Username or email already exists.' });
      }
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const existing = await UserModel.findById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'User not found.' });

      const data = { ...req.body };
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      } else {
        delete data.password;
      }

      const user = await UserModel.update(req.params.id, data);
      res.json({ success: true, data: user });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ success: false, message: 'Username or email already exists.' });
      }
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const existing = await UserModel.findById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'User not found.' });
      if (existing.id === req.user.id) {
        return res.status(400).json({ success: false, message: 'Cannot delete your own account.' });
      }
      await UserModel.delete(req.params.id);
      res.json({ success: true, message: 'User deleted successfully.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
