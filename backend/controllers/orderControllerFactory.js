import { isOrderNumberTaken, DUPLICATE_ORDER_MESSAGE } from '../utils/orderNumber.js';
import pool from '../config/db.js';

function isDbConnectionError(err) {
  return (
    err.code === 'ECONNREFUSED' ||
    err.code === 'PROTOCOL_CONNECTION_LOST' ||
    /ECONNREFUSED|connect/i.test(err.message || '')
  );
}

function emptyOrderList() {
  return [];
}

export function createOrderController({ model, table, validate }) {
  return {
    async list(req, res) {
      try {
        const data = await model.findAll(
          req.query.search || '',
          req.query.status || '',
          req.query.payment_status || '',
          req.query.delivery_status || ''
        );
        res.json({ success: true, data });
      } catch (err) {
        if (isDbConnectionError(err)) {
          return res.json({ success: true, data: emptyOrderList() });
        }

        res.status(500).json({ success: false, message: 'Unable to load orders.' });
      }
    },

    async get(req, res) {
      try {
        const order = await model.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
        res.json({ success: true, data: order });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    async checkOrderNumber(req, res) {
      try {
        const { order_number, exclude_id } = req.query;
        if (!order_number?.trim()) {
          return res.json({ success: true, taken: false });
        }
        const taken = await isOrderNumberTaken(order_number.trim(), table, exclude_id || null);
        res.json({ success: true, taken });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    async create(req, res) {
      try {
        const errors = await validate(req.body);
        if (Object.keys(errors).length) {
          return res.status(400).json({ success: false, message: 'Validation failed.', errors });
        }

        const orderNumber = req.body.order_number.trim();
        if (await isOrderNumberTaken(orderNumber)) {
          return res.status(409).json({
            success: false,
            message: DUPLICATE_ORDER_MESSAGE,
            errors: { order_number: DUPLICATE_ORDER_MESSAGE },
          });
        }

        const [customer] = await pool.query('SELECT id FROM customers WHERE id = ?', [req.body.customer_id]);
        if (!customer.length) {
          return res.status(400).json({ success: false, message: 'Validation failed.', errors: { customer_id: 'Customer is required.' } });
        }

        const { columns, values } = buildInsert(req.body, orderNumber);
        const order = await model.create(req.body, columns, values);
        res.status(201).json({ success: true, data: order });
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({
            success: false,
            message: DUPLICATE_ORDER_MESSAGE,
            errors: { order_number: DUPLICATE_ORDER_MESSAGE },
          });
        }
        res.status(500).json({ success: false, message: err.message });
      }
    },

    async update(req, res) {
      try {
        const existing = await model.findById(req.params.id);
        if (!existing) return res.status(404).json({ success: false, message: 'Order not found.' });

        const errors = await validate(req.body, true);
        if (Object.keys(errors).length) {
          return res.status(400).json({ success: false, message: 'Validation failed.', errors });
        }

        const orderNumber = req.body.order_number.trim();
        if (await isOrderNumberTaken(orderNumber, table, req.params.id)) {
          return res.status(409).json({
            success: false,
            message: DUPLICATE_ORDER_MESSAGE,
            errors: { order_number: DUPLICATE_ORDER_MESSAGE },
          });
        }

        const [customer] = await pool.query('SELECT id FROM customers WHERE id = ?', [req.body.customer_id]);
        if (!customer.length) {
          return res.status(400).json({ success: false, message: 'Validation failed.', errors: { customer_id: 'Customer is required.' } });
        }

        const { sets, values } = buildUpdate(req.body, orderNumber);
        const order = await model.update(req.params.id, sets, values);
        res.json({ success: true, data: order });
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({
            success: false,
            message: DUPLICATE_ORDER_MESSAGE,
            errors: { order_number: DUPLICATE_ORDER_MESSAGE },
          });
        }
        res.status(500).json({ success: false, message: err.message });
      }
    },

    async remove(req, res) {
      try {
        const existing = await model.findById(req.params.id);
        if (!existing) return res.status(404).json({ success: false, message: 'Order not found.' });
        await model.delete(req.params.id);
        res.json({ success: true, message: 'Order deleted successfully.' });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },
  };
}

function buildInsert(body, orderNumber) {
  return { columns: Object.keys(body).map((k) => k === 'order_number' ? 'order_number' : k), values: Object.values({ ...body, order_number: orderNumber }) };
}

function buildUpdate(body, orderNumber) {
  const data = { ...body, order_number: orderNumber };
  const sets = Object.keys(data).map((k) => `${k} = ?`);
  const values = Object.values(data);
  return { sets, values };
}

export async function validateOrderNumber(order_number, errors) {
  if (!order_number?.trim()) {
    errors.order_number = 'Order number is required.';
  } else if (order_number.trim().length > 50) {
    errors.order_number = 'Order number must be 50 characters or less.';
  }
}

export async function validateCustomer(customer_id, errors) {
  if (!customer_id) errors.customer_id = 'Customer is required.';
}

export function validatePrice(price, field, errors) {
  if (price !== undefined && price !== null && price !== '' && Number(price) < 0) {
    errors[field] = 'Price must be a valid positive number.';
  }
}
