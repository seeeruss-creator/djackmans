import { RentOrderModel } from '../models/index.js';
import { createOrderController, validateOrderNumber, validateCustomer, validatePrice } from './orderControllerFactory.js';
import { isOrderNumberTaken, DUPLICATE_ORDER_MESSAGE } from '../utils/orderNumber.js';
import { calcFinancials, normalizeStatus, DELIVERY_STATUSES } from '../utils/pricing.js';

async function validateRent(body) {
  const errors = {};
  await validateOrderNumber(body.order_number, errors);
  await validateCustomer(body.customer_id, errors);
  if (!body.garment_name?.trim()) errors.garment_name = 'Garment name/type is required.';
  if (!body.rental_start_date) errors.rental_start_date = 'Rental start date is required.';
  if (!body.rental_end_date) {
    errors.rental_end_date = 'Rental return date is required.';
  } else if (body.rental_start_date && body.rental_end_date < body.rental_start_date) {
    errors.rental_end_date = 'Rental return date must be on or after start date.';
  }
  if (body.price === undefined || body.price === null || body.price === '') {
    errors.price = 'Rental price is required.';
  } else {
    validatePrice(body.price, 'price', errors);
  }
  validatePrice(body.deposit, 'deposit', errors);
  validatePrice(body.additional_charges, 'additional_charges', errors);
  validatePrice(body.discount, 'discount', errors);
  validatePrice(body.amount_paid, 'amount_paid', errors);
  if (body.quantity !== undefined && body.quantity !== '' && Number(body.quantity) < 1) {
    errors.quantity = 'Quantity must be at least 1.';
  }
  return errors;
}

function buildRentData(body, orderNumber) {
  const start = new Date(body.rental_start_date);
  const end = new Date(body.rental_end_date);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  const financials = calcFinancials({
    basePrice: body.price,
    additionalCharges: body.additional_charges,
    discount: body.discount,
    amountPaid: body.amount_paid,
    paymentStatusOverride: body.payment_status || null,
  });
  const delivery = DELIVERY_STATUSES.includes(body.delivery_status) ? body.delivery_status : 'pending';

  return {
    order_number: orderNumber,
    customer_id: body.customer_id,
    order_date: body.order_date || null,
    due_date: body.due_date || body.rental_end_date || null,
    garment_name: body.garment_name.trim(),
    brand: body.brand?.trim() || null,
    size: body.size?.trim() || null,
    color: body.color?.trim() || null,
    fabric: body.fabric?.trim() || null,
    quantity: Number(body.quantity) || 1,
    description: body.description?.trim() || null,
    special_instructions: body.special_instructions?.trim() || null,
    rental_start_date: body.rental_start_date,
    rental_end_date: body.rental_end_date,
    rental_duration: duration > 0 ? duration : null,
    deposit: body.deposit ?? 0,
    price: body.price,
    additional_charges: financials.additional_charges,
    discount: financials.discount,
    total_amount: financials.total_amount,
    amount_paid: financials.amount_paid,
    balance: financials.balance,
    status: normalizeStatus(body.status),
    payment_status: financials.payment_status,
    delivery_status: delivery,
    notes: body.notes || null,
  };
}

const base = createOrderController({ model: RentOrderModel, table: 'rent_orders', validate: validateRent });

export const RentOrderController = {
  ...base,
  async create(req, res) {
    try {
      const errors = await validateRent(req.body);
      if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Validation failed.', errors });
      const orderNumber = req.body.order_number.trim();
      if (await isOrderNumberTaken(orderNumber)) {
        return res.status(409).json({ success: false, message: DUPLICATE_ORDER_MESSAGE, errors: { order_number: DUPLICATE_ORDER_MESSAGE } });
      }
      const data = buildRentData(req.body, orderNumber);
      const order = await RentOrderModel.create(req.body, Object.keys(data), Object.values(data));
      res.status(201).json({ success: true, data: order });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Unable to create rental order.' });
    }
  },
  async update(req, res) {
    try {
      const existing = await RentOrderModel.findById(req.params.id);
      if (!existing) return res.status(404).json({ success: false, message: 'Order not found.' });
      const errors = await validateRent(req.body);
      if (Object.keys(errors).length) return res.status(400).json({ success: false, message: 'Validation failed.', errors });
      const orderNumber = req.body.order_number.trim();
      if (await isOrderNumberTaken(orderNumber, 'rent_orders', req.params.id)) {
        return res.status(409).json({ success: false, message: DUPLICATE_ORDER_MESSAGE, errors: { order_number: DUPLICATE_ORDER_MESSAGE } });
      }
      const data = buildRentData(req.body, orderNumber);
      const order = await RentOrderModel.update(req.params.id, Object.keys(data).map((k) => `${k} = ?`), Object.values(data));
      res.json({ success: true, data: order });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Unable to update rental order.' });
    }
  },
};
