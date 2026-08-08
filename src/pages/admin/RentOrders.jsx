import { useState } from 'react';
import OrderListPage from '../../components/admin/OrderListPage.jsx';
import OrderFormModal from '../../components/admin/OrderFormModal.jsx';
import FormField, { inputClass } from '../../components/admin/FormField.jsx';
import CustomerFields, {
  emptyCustomerFields,
  customerFieldsFromOrder,
  validateCustomerFields,
  resolveCustomerId,
  stripCustomerFormFields,
} from '../../components/admin/CustomerFields.jsx';
import FinancialFields, { sliceDate, applyApiErrors } from '../../components/admin/FinancialFields.jsx';
import { calcFinancials } from '../../utils/pricing.js';
import { RentOrderApi } from '../../api/RentOrderApi.js';

function emptyForm() {
  return {
    order_number: '',
    ...emptyCustomerFields(),
    order_date: '',
    due_date: '',
    garment_name: '',
    brand: '',
    size: '',
    color: '',
    fabric: '',
    quantity: 1,
    description: '',
    special_instructions: '',
    rental_start_date: '',
    rental_end_date: '',
    price: '',
    deposit: '',
    additional_charges: '',
    discount: '',
    amount_paid: '',
    status: 'received',
    payment_status: 'unpaid',
  };
}

function fromOrder(order) {
  return {
    order_number: order.order_number || '',
    ...customerFieldsFromOrder(order),
    order_date: sliceDate(order.order_date),
    due_date: sliceDate(order.due_date),
    garment_name: order.garment_name || '',
    brand: order.brand || '',
    size: order.size || '',
    color: order.color || '',
    fabric: order.fabric || '',
    quantity: order.quantity ?? 1,
    description: order.description || '',
    special_instructions: order.special_instructions || '',
    rental_start_date: sliceDate(order.rental_start_date),
    rental_end_date: sliceDate(order.rental_end_date),
    price: order.price ?? '',
    deposit: order.deposit ?? '',
    additional_charges: order.additional_charges ?? '',
    discount: order.discount ?? '',
    amount_paid: order.amount_paid ?? '',
    status: order.status || 'received',
    payment_status: order.payment_status || 'unpaid',
  };
}

function RentOrderForm({ order, onClose, onSaved, api }) {
  const [form, setForm] = useState(order ? fromOrder(order) : emptyForm());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.order_number?.trim()) e.order_number = 'Order number is required.';
    else if (form.order_number.trim().length > 50) e.order_number = 'Order number must be 50 characters or less.';
    validateCustomerFields(form, e);
    if (!form.garment_name?.trim()) e.garment_name = 'Garment name is required.';
    if (!form.rental_start_date) e.rental_start_date = 'Rental start date is required.';
    if (!form.rental_end_date) e.rental_end_date = 'Rental end date is required.';
    else if (form.rental_start_date && form.rental_end_date < form.rental_start_date) {
      e.rental_end_date = 'Rental end date must be on or after start date.';
    }
    if (form.price === '' || form.price === undefined) e.price = 'Price is required.';
    else if (Number(form.price) < 0) e.price = 'Price must be a valid positive number.';
    if (form.quantity !== '' && Number(form.quantity) < 1) e.quantity = 'Quantity must be at least 1.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const customer_id = await resolveCustomerId(form);
      const payload = {
        ...stripCustomerFormFields(form),
        ...calcFinancials(form),
        customer_id,
      };
      if (order) await api.update(order.id, payload);
      else await api.create(payload);
      onSaved();
    } catch (err) {
      setErrors(applyApiErrors(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <OrderFormModal title={order ? 'Edit Rental Order' : 'New Rental Order'} onClose={onClose} onSubmit={handleSubmit} submitting={submitting} errors={errors}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Order Number" error={errors.order_number} required>
          <input className={inputClass(errors.order_number)} value={form.order_number} onChange={(e) => set('order_number', e.target.value)} maxLength={50} placeholder="e.g. RENT-001" />
        </FormField>
        <FormField label="Order Date">
          <input type="date" className={inputClass()} value={form.order_date} onChange={(e) => set('order_date', e.target.value)} />
        </FormField>
        <FormField label="Due Date">
          <input type="date" className={inputClass()} value={form.due_date} onChange={(e) => set('due_date', e.target.value)} />
        </FormField>
      </div>
      <CustomerFields form={form} set={set} errors={errors} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Garment Name" error={errors.garment_name} required>
          <input className={inputClass(errors.garment_name)} value={form.garment_name} onChange={(e) => set('garment_name', e.target.value)} />
        </FormField>
        <FormField label="Brand">
          <input className={inputClass()} value={form.brand} onChange={(e) => set('brand', e.target.value)} />
        </FormField>
        <FormField label="Size">
          <input className={inputClass()} value={form.size} onChange={(e) => set('size', e.target.value)} />
        </FormField>
        <FormField label="Color">
          <input className={inputClass()} value={form.color} onChange={(e) => set('color', e.target.value)} />
        </FormField>
        <FormField label="Fabric">
          <input className={inputClass()} value={form.fabric} onChange={(e) => set('fabric', e.target.value)} />
        </FormField>
        <FormField label="Quantity" error={errors.quantity}>
          <input type="number" min="1" className={inputClass(errors.quantity)} value={form.quantity} onChange={(e) => set('quantity', e.target.value)} />
        </FormField>
        <FormField label="Rental Start Date" error={errors.rental_start_date} required>
          <input type="date" className={inputClass(errors.rental_start_date)} value={form.rental_start_date} onChange={(e) => set('rental_start_date', e.target.value)} />
        </FormField>
        <FormField label="Rental End Date" error={errors.rental_end_date} required>
          <input type="date" className={inputClass(errors.rental_end_date)} value={form.rental_end_date} onChange={(e) => set('rental_end_date', e.target.value)} />
        </FormField>
      </div>
      <FormField label="Description">
        <textarea className={inputClass()} rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </FormField>
      <FormField label="Special Instructions">
        <textarea className={inputClass()} rows={2} value={form.special_instructions} onChange={(e) => set('special_instructions', e.target.value)} />
      </FormField>
      <FinancialFields form={form} set={set} errors={errors} includeDeposit />
    </OrderFormModal>
  );
}

export default function RentOrders() {
  return (
    <OrderListPage
      title="Rental Orders"
      columns={['Order #', 'Customer', 'Garment', 'Period', 'Total']}
      api={RentOrderApi}
      FormComponent={RentOrderForm}
      renderRow={(order, { formatMoney }) => (
        <>
          <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{order.order_number}</td>
          <td className="px-4 py-3">
            <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
            <div className="text-xs text-gray-400">{order.customer_phone}</div>
          </td>
          <td className="px-4 py-3 text-sm text-gray-700">{order.garment_name}</td>
          <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
            {sliceDate(order.rental_start_date)} → {sliceDate(order.rental_end_date)}
          </td>
          <td className="px-4 py-3 text-sm text-gray-700">{formatMoney(order.total_amount ?? order.price)}</td>
        </>
      )}
    />
  );
}
