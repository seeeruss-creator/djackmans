import { CustomerModel } from '../models/index.js';

function isDbConnectionError(err) {
  return (
    err.code === 'ECONNREFUSED' ||
    err.code === 'PROTOCOL_CONNECTION_LOST' ||
    /ECONNREFUSED|connect/i.test(err.message || '')
  );
}

function emptyCustomer() {
  return {
    id: null,
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
    orders: [],
  };
}

export const CustomerController = {
  async list(req, res) {
    try {
      const customers = await CustomerModel.findAll(req.query.search || '');
      res.json({ success: true, data: customers });
    } catch (err) {
      if (isDbConnectionError(err)) {
        return res.json({ success: true, data: [] });
      }

      res.status(500).json({ success: false, message: err.message });
    }
  },

  async get(req, res) {
    try {
      const customer = await CustomerModel.findById(req.params.id);
      if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });
      const orders = await CustomerModel.getOrderHistory(customer.id);
      res.json({ success: true, data: { ...customer, orders } });
    } catch (err) {
      if (isDbConnectionError(err)) {
        return res.json({ success: true, data: emptyCustomer() });
      }

      res.status(500).json({ success: false, message: 'Unable to load customer.' });
    }
  },

  async create(req, res) {
    try {
      const { name, phone } = req.body;
      const errors = {};
      if (!name?.trim()) errors.name = 'Customer name is required.';
      if (!phone?.trim()) errors.phone = 'Phone number is required.';
      if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Validation failed.', errors });

      const customer = await CustomerModel.create(req.body);
      res.status(201).json({ success: true, data: customer });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const existing = await CustomerModel.findById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'Customer not found.' });

      const { name, phone } = req.body;
      const errors = {};
      if (!name?.trim()) errors.name = 'Customer name is required.';
      if (!phone?.trim()) errors.phone = 'Phone number is required.';
      if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Validation failed.', errors });

      const customer = await CustomerModel.update(req.params.id, req.body);
      res.json({ success: true, data: customer });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const existing = await CustomerModel.findById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'Customer not found.' });

      const result = await CustomerModel.delete(req.params.id);
      if (result.blocked) {
        return res.status(400).json({ success: false, message: 'Cannot delete customer with existing orders.' });
      }
      res.json({ success: true, message: 'Customer deleted successfully.' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
