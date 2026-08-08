export const ORDER_STATUSES = [
  { value: 'received', label: 'Received' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'ready_for_pickup', label: 'Ready for Pickup' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const PAYMENT_STATUSES = [
  { value: 'unpaid', label: 'Unpaid' },
  { value: 'partially_paid', label: 'Partially Paid' },
  { value: 'paid', label: 'Paid' },
];

export const STATUS_LABELS = Object.fromEntries(
  [
    ...ORDER_STATUSES,
    ...PAYMENT_STATUSES,
  ].map((s) => [s.value, s.label])
);
