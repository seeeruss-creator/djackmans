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
import { CustomizationOrderApi } from '../../api/CustomizationOrderApi.js';

function emptyForm() {
  return {
    order_number: '',
    ...emptyCustomerFields(),
    order_date: '',
    due_date: '',
    garment_type: '',
    fabric_type: '',
    color: '',
    style: '',
    quantity: 1,
    measurements: '',
    design_description: '',
    embellishments: '',
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
    fabric_type: order.fabric_type || '',
    color: order.color || '',
    style: order.style || '',
    quantity: order.quantity ?? 1,
    measurements: order.measurements || '',
    design_description: order.design_description || '',
    embellishments: order.embellishments || '',
    special_instructions: order.special_instructions || '',
    price: order.price ?? '',
    additional_charges: order.additional_charges ?? '',
    discount: order.discount ?? '',
    amount_paid: order.amount_paid ?? '',
    status: order.status || 'received',
    payment_status: order.payment_status || 'unpaid',
  };
}

function CustomizationForm({ order, onClose, onSaved, api }) {
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
    if (form.quantity !== '' && Number(form.quantity) < 1) e.quantity = 'Quantity must be at least 1.';
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
    <OrderFormModal title={order ? 'Edit Customization Order' : 'New Customization Order'} onClose={onClose} onSubmit={handleSubmit} submitting={submitting} errors={errors}>
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
          <input className={inputClass(errors.garment_type)} value={form.garment_type} onChange={(e) => set('garment_type', e.target.value)} placeholder="e.g. Suit, Barong, Dress" />
        </FormField>
        <FormField label="Fabric Type">
          <input className={inputClass()} value={form.fabric_type} onChange={(e) => set('fabric_type', e.target.value)} />
        </FormField>
        <FormField label="Color">
          <input className={inputClass()} value={form.color} onChange={(e) => set('color', e.target.value)} />
        </FormField>
        <FormField label="Style">
          <input className={inputClass()} value={form.style} onChange={(e) => set('style', e.target.value)} />
        </FormField>
        <FormField label="Quantity" error={errors.quantity}>
          <input type="number" min="1" className={inputClass(errors.quantity)} value={form.quantity} onChange={(e) => set('quantity', e.target.value)} />
        </FormField>
      </div>
      <FormField label="Measurements">
        <textarea className={inputClass()} rows={2} value={form.measurements} onChange={(e) => set('measurements', e.target.value)} placeholder="Chest, waist, hips, length..." />
      </FormField>
      <FormField label="Design Description">
        <textarea className={inputClass()} rows={2} value={form.design_description} onChange={(e) => set('design_description', e.target.value)} />
      </FormField>
      <FormField label="Embellishments">
        <input className={inputClass()} value={form.embellishments} onChange={(e) => set('embellishments', e.target.value)} />
      </FormField>
      <FormField label="Special Instructions">
        <textarea className={inputClass()} rows={2} value={form.special_instructions} onChange={(e) => set('special_instructions', e.target.value)} />
      </FormField>
      <FinancialFields form={form} set={set} errors={errors} />
    </OrderFormModal>
  );
}

export default function CustomizationOrders() {
  return (
    <OrderListPage
      title="Customization Orders"
      columns={['Order #', 'Customer', 'Garment', 'Due', 'Total']}
      api={CustomizationOrderApi}
      FormComponent={CustomizationForm}
      renderRow={(order, { formatMoney }) => (
        <>
          <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-700">{order.order_number}</td>
          <td className="px-4 py-3">
            <div className="text-sm font-medium text-gray-900">{order.customer_name}</div>
            <div className="text-xs text-gray-400">{order.customer_phone}</div>
          </td>
          <td className="px-4 py-3 text-sm text-gray-700">{order.garment_type}</td>
          <td className="px-4 py-3 text-xs text-gray-500">{sliceDate(order.due_date || order.estimated_completion_date) || '—'}</td>
          <td className="px-4 py-3 text-sm text-gray-700">{formatMoney(order.total_amount ?? order.price)}</td>
        </>
      )}
    />
  );
}
