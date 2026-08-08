export function calcFinancials({
  basePrice = 0,
  additionalCharges = 0,
  discount = 0,
  amountPaid = 0,
  paymentStatusOverride = null,
}) {
  const price = Math.max(0, Number(basePrice) || 0);
  const charges = Math.max(0, Number(additionalCharges) || 0);
  const disc = Math.max(0, Number(discount) || 0);
  const paid = Math.max(0, Number(amountPaid) || 0);
  const total = Math.max(0, price + charges - disc);
  const balance = Math.max(0, total - paid);

  let payment_status = 'unpaid';
  if (paid <= 0) payment_status = 'unpaid';
  else if (paid >= total && total > 0) payment_status = 'paid';
  else if (paid > 0 && paid < total) payment_status = 'partially_paid';
  else if (total === 0 && paid === 0) payment_status = 'paid';

  const allowed = ['unpaid', 'partially_paid', 'paid'];
  if (paymentStatusOverride && allowed.includes(paymentStatusOverride)) {
    payment_status = paymentStatusOverride;
  }

  return {
    total_amount: Number(total.toFixed(2)),
    balance: Number(balance.toFixed(2)),
    amount_paid: Number(paid.toFixed(2)),
    additional_charges: Number(charges.toFixed(2)),
    discount: Number(disc.toFixed(2)),
    payment_status,
  };
}

export const ORDER_STATUSES = [
  'received',
  'in_progress',
  'ready_for_pickup',
  'completed',
  'cancelled',
];

export const PAYMENT_STATUSES = ['unpaid', 'partially_paid', 'paid'];
export const DELIVERY_STATUSES = ['pending', 'ready', 'delivered'];

export function normalizeStatus(status, fallback = 'received') {
  if (!status) return fallback;
  const map = {
    pending: 'received',
    ready_to_pickup: 'ready_for_pickup',
    rented: 'in_progress',
    returned: 'completed',
  };
  const value = map[status] || status;
  return ORDER_STATUSES.includes(value) ? value : fallback;
}
