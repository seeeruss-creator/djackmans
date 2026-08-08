import FormField, { inputClass } from './FormField.jsx';
import { CustomerApi } from '../../api/CustomerApi.js';

/** Empty customer fields for new order forms */
export function emptyCustomerFields() {
  return {
    customer_id: '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    customer_address: '',
    customer_notes: '',
  };
}

/** Prefill customer fields when editing an order */
export function customerFieldsFromOrder(order) {
  return {
    customer_id: order.customer_id || '',
    customer_name: order.customer_name || '',
    customer_phone: order.customer_phone || '',
    customer_email: order.customer_email || '',
    customer_address: order.customer_address || '',
    customer_notes: order.customer_notes || '',
  };
}

export function validateCustomerFields(form, errors = {}) {
  if (!form.customer_name?.trim()) errors.customer_name = 'Customer name is required.';
  if (!form.customer_phone?.trim()) errors.customer_phone = 'Contact number is required.';
  return errors;
}

/**
 * Create or update a customer from filled-in order form fields,
 * then return the customer_id for the order payload.
 */
export async function resolveCustomerId(form) {
  const data = {
    name: form.customer_name.trim(),
    phone: form.customer_phone.trim(),
    email: form.customer_email?.trim() || null,
    address: form.customer_address?.trim() || null,
    notes: form.customer_notes?.trim() || null,
  };

  // Prefer updating the linked customer when editing
  if (form.customer_id) {
    await CustomerApi.update(form.customer_id, data);
    return form.customer_id;
  }

  // Match existing by exact phone to avoid duplicates
  const res = await CustomerApi.list(data.phone);
  const match = (res.data.data || []).find((c) => c.phone === data.phone);
  if (match) {
    await CustomerApi.update(match.id, data);
    return match.id;
  }

  const created = await CustomerApi.create(data);
  return created.data.data.id;
}

export function stripCustomerFormFields(form) {
  const {
    customer_name,
    customer_phone,
    customer_email,
    customer_address,
    customer_notes,
    ...rest
  } = form;
  return rest;
}

/** Customer info as normal fillable order fields (no dropdown/search picker) */
export default function CustomerFields({ form, set, errors }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-admin-muted">Customer Information</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Full Name" error={errors.customer_name} required>
          <input
            className={inputClass(errors.customer_name)}
            value={form.customer_name}
            onChange={(e) => set('customer_name', e.target.value)}
            placeholder="Customer full name"
          />
        </FormField>
        <FormField label="Contact Number" error={errors.customer_phone} required>
          <input
            className={inputClass(errors.customer_phone)}
            value={form.customer_phone}
            onChange={(e) => set('customer_phone', e.target.value)}
            placeholder="Phone number"
          />
        </FormField>
        <FormField label="Email" error={errors.customer_email}>
          <input
            type="email"
            className={inputClass(errors.customer_email)}
            value={form.customer_email}
            onChange={(e) => set('customer_email', e.target.value)}
            placeholder="Optional"
          />
        </FormField>
        <FormField label="Address" error={errors.customer_address}>
          <input
            className={inputClass(errors.customer_address)}
            value={form.customer_address}
            onChange={(e) => set('customer_address', e.target.value)}
            placeholder="Optional"
          />
        </FormField>
      </div>
      <FormField label="Customer Notes" error={errors.customer_notes}>
        <textarea
          className={inputClass(errors.customer_notes)}
          rows={2}
          value={form.customer_notes}
          onChange={(e) => set('customer_notes', e.target.value)}
          placeholder="Optional notes about this customer"
        />
      </FormField>
    </div>
  );
}
