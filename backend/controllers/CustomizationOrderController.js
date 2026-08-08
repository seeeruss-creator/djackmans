import { CustomizationOrderModel } from '../models/index.js';
import { createOrderController, validateOrderNumber, validateCustomer, validatePrice } from './orderControllerFactory.js';
import { isOrderNumberTaken, DUPLICATE_ORDER_MESSAGE } from '../utils/orderNumber.js';
import { calcFinancials, normalizeStatus, DELIVERY_STATUSES } from '../utils/pricing.js';
import pool from '../config/db.js';

async function validateCustomization(body) {
  const errors = {};
  await validateOrderNumber(body.order_number, errors);
  await validateCustomer(body.customer_id, errors);
  if (!body.garment_type?.trim()) errors.garment_type = 'Garment type is required.';
  validatePrice(body.price, 'price', errors);
  validatePrice(body.additional_charges, 'additional_charges', errors);
  validatePrice(body.discount, 'discount', errors);
  validatePrice(body.amount_paid, 'amount_paid', errors);
  if (body.quantity !== undefined && body.quantity !== '' && Number(body.quantity) < 1) {
    errors.quantity = 'Quantity must be at least 1.';
  }
  return errors;
}

function buildData(body, orderNumber) {
  const financials = calcFinancials({
    basePrice: body.price,
    additionalCharges: body.additional_charges,
    discount: body.discount,
    amountPaid: body.amount_paid,
    paymentStatusOverride: body.payment_status || null,
  });
  return {
    order_number: orderNumber,
    customer_id: body.customer_id,
    order_date: body.order_date || null,
    due_date: body.due_date || body.estimated_completion_date || null,
    garment_type: body.garment_type.trim(),
    fabric_type: body.fabric_type?.trim() || null,
    color: body.color?.trim() || null,
    style: body.style?.trim() || null,
    quantity: Number(body.quantity) || 1,
    measurements: body.measurements?.trim() || null,
    design_description: body.design_description?.trim() || null,
    embellishments: body.embellishments?.trim() || null,
    special_instructions: body.special_instructions?.trim() || null,
    estimated_completion_date: body.due_date || body.estimated_completion_date || null,
    price: body.price ?? null,
    additional_charges: financials.additional_charges,
    discount: financials.discount,
    total_amount: financials.total_amount,
    amount_paid: financials.amount_paid,
    balance: financials.balance,
    status: normalizeStatus(body.status),
    payment_status: financials.payment_status,
    delivery_status: DELIVERY_STATUSES.includes(body.delivery_status) ? body.delivery_status : 'pending',
    notes: body.notes || null,
  };
}

const base = createOrderController({ model: CustomizationOrderModel, table: 'customization_orders', validate: validateCustomization });

export const CustomizationOrderController = {
  ...base,
  async create(req, res) {
    try {
      const errors = await validateCustomization(req.body);
      if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Validation failed.', errors });
      const orderNumber = req.body.order_number.trim();
      if (await isOrderNumberTaken(orderNumber)) {
        return res.status(409).json({ success: false, message: DUPLICATE_ORDER_MESSAGE, errors: { order_number: DUPLICATE_ORDER_MESSAGE } });
      }
      const [customer] = await pool.query('SELECT id FROM customers WHERE id = ?', [req.body.customer_id]);
      if (!customer.length) return res.status(400).json({ success: false, message: 'Validation failed.', errors: { customer_id: 'Customer is required.' } });
      const data = buildData(req.body, orderNumber);
      const order = await CustomizationOrderModel.create(req.body, Object.keys(data), Object.values(data));
      res.status(201).json({ success: true, data: order });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Unable to create customization order.' });
    }
  },
  async update(req, res) {
    try {
      const existing = await CustomizationOrderModel.findById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'Order not found.' });
      const errors = await validateCustomization(req.body);
      if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Validation failed.', errors });
      const orderNumber = req.body.order_number.trim();
      if (await isOrderNumberTaken(orderNumber, 'customization_orders', req.params.id)) {
        return res.status(409).json({ success: false, message: DUPLICATE_ORDER_MESSAGE, errors: { order_number: DUPLICATE_ORDER_MESSAGE } });
      }
      const data = buildData(req.body, orderNumber);
      const order = await CustomizationOrderModel.update(req.params.id, Object.keys(data).map((k) => `${k} = ?`), Object.values(data));
      res.json({ success: true, data: order });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Unable to update customization order.' });
    }
  },
};
