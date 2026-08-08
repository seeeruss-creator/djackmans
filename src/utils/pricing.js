export function calcFinancials({
  price = 0,
  additional_charges = 0,
  discount = 0,
  amount_paid = 0,
}) {
  const base = Math.max(0, Number(price) || 0);
  const charges = Math.max(0, Number(additional_charges) || 0);
  const disc = Math.max(0, Number(discount) || 0);
  const paid = Math.max(0, Number(amount_paid) || 0);
  const total = Math.max(0, base + charges - disc);
  const balance = Math.max(0, total - paid);

  let payment_status = 'unpaid';
  if (total === 0 && paid === 0) payment_status = 'paid';
  else if (paid <= 0) payment_status = 'unpaid';
  else if (paid >= total) payment_status = 'paid';
  else payment_status = 'partially_paid';

  return {
    total_amount: Number(total.toFixed(2)),
    balance: Number(balance.toFixed(2)),
    amount_paid: Number(paid.toFixed(2)),
    payment_status,
  };
}

export function formatMoney(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return '—';
  return `₱${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
