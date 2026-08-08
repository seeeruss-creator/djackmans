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
import { RepairOrderApi } from '../../api/RepairOrderApi.js';

function emptyForm() {
  return {
    order_number: '',
    ...emptyCustomerFields(),
    order_date: '',
    due_date: '',
    garment_type: '',
    repair_type: '',
    damage_description: '',
    required_work: '',
    quantity: 1,
    special_instructions: '',
    price: '',
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
    due_date: sliceDate(order.due_date || order.estimated_completion_date),
    garment_type: order.garment_type || '',
    repair_type: order.repair_type || '',
    damage_description: order.damage_description || '',
    required_work: order.required_work || '',
    quantity: order.quantity ?? 1,
    special_instructions: order.special_instructions || '',
    price: order.price ?? '',
    additional_charges: order.additional_charges ?? '',
    discount: order.discount ?? '',
    amount_paid: order.amount_paid ?? '',
    status: order.status || 'received',
    payment_status: order.payment_status || 'unpaid',
  };
}

function RepairForm({ order, onClose, onSaved, api }) {
  const [form, setForm] = useState(order ? fromOrder(order) : emptyForm());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.order_number?.trim()) e.order_number = 'Order number is required.';
    else if (form.order_number.trim().length > 50) e.order_number = 'Order number must be 50 characters or less.';
    validateCustomerFields(form, e);
    if (!form.garment_type?.trim()) e.garment_type = 'Garment type is required.';
    if (!form.damage_description?.trim()) e.damage_description = 'Problem description is required.';
    if (form.price !== '' && Number(form.price) < 0) e.price = 'Price must be a valid positive number.';
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
    <OrderFormModal title={order ? 'Edit Repair Order' : 'New Repair Order'} onClose={onClose} onSubmit={handleSubmit} submitting={submitting} errors={errors}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Order Number" error={errors.order_number} required>
          <input className={inputClass(errors.order_number)} value={form.order_number} onChange={(e) => set('order_number', e.target.value)} maxLength={50} />
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
        <FormField label="Garment Type" error={errors.garment_type} required>
          <input className={inputClass(errors.garment_type)} value={form.garment_type} onChange={(e) => set('garment_type', e.target.value)} />
        </FormField>
        <FormField label="Repair Type">
          <input className={inputClass()} value={form.repair_type} onChange={(e) => set('repair_type', e.target.value)} placeholder="e.g. Hem, Zipper, Patch" />
        </FormField>
        <FormField label="Quantity">
          <input type="number" min="1" className={inputClass()} value={form.quantity} onChange={(e) => set('quantity', e.target.value)} />
        </FormField>
      </div>
      <FormField label="Problem Description" error={errors.damage_description} required>
        <textarea className={inputClass(errors.damage_description)} rows={3} value={form.damage_description} onChange={(e) => set('damage_description', e.target.value)} />
      </FormField>
      <FormField label="Required Work">
        <textarea className={inputClass()} rows={2} value={form.required_work} onChange={(e) => set('required_work', e.target.value)} />
      </FormField>
      <FormField label="Special Instructions">
        <textarea className={inputClass()} rows={2} value={form.special_instructions} onChange={(e) => set('special_instructions', e.target.value)} />
      </FormField>
      <FinancialFields form={form} set={set} errors={errors} />
    </OrderFormModal>
  );
}

export default function RepairOrders() {
  return (
    <OrderListPage
      title="Repair Orders"
      columns={['Order #', 'Customer', 'Garment', 'Repair', 'Total']}
      api={RepairOrderApi}
      FormComponent={RepairForm}
      renderRow={(order, { formatMoney }) => (
        <>
          <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{order.order_number}</td>
          <td className="px-4 py-3">
            <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
            <div className="text-xs text-gray-400">{order.customer_phone}</div>
          </td>
          <td className="px-4 py-3 text-sm text-gray-700">{order.garment_type}</td>
          <td className="px-4 py-3 text-sm text-gray-500">{order.repair_type || '—'}</td>
          <td className="px-4 py-3 text-sm text-gray-700">{formatMoney(order.total_amount ?? order.price)}</td>
        </>
      )}
    />
  );
}
