import FormField, { inputClass } from './FormField.jsx';
import { PAYMENT_STATUSES, ORDER_STATUSES } from '../../constants/statuses.js';
import { calcFinancials, formatMoney } from '../../utils/pricing.js';

export default function FinancialFields({ form, set, errors, includeDeposit = false }) {
  const fin = calcFinancials(form);

  const onPaidChange = (v) => {
    const next = calcFinancials({ ...form, amount_paid: v });
    set('amount_paid', v);
    set('payment_status', next.payment_status);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Price" error={errors.price} required={includeDeposit}>
          <input type="number" step="0.01" min="0" className={inputClass(errors.price)} value={form.price} onChange={(e) => set('price', e.target.value)} />
        </FormField>
        {includeDeposit && (
          <FormField label="Deposit" error={errors.deposit}>
            <input type="number" step="0.01" min="0" className={inputClass(errors.deposit)} value={form.deposit} onChange={(e) => set('deposit', e.target.value)} />
          </FormField>
        )}
        <FormField label="Additional Charges" error={errors.additional_charges}>
          <input type="number" step="0.01" min="0" className={inputClass(errors.additional_charges)} value={form.additional_charges} onChange={(e) => set('additional_charges', e.target.value)} />
        </FormField>
        <FormField label="Discount" error={errors.discount}>
          <input type="number" step="0.01" min="0" className={inputClass(errors.discount)} value={form.discount} onChange={(e) => set('discount', e.target.value)} />
        </FormField>
        <FormField label="Amount Paid" error={errors.amount_paid}>
          <input type="number" step="0.01" min="0" className={inputClass(errors.amount_paid)} value={form.amount_paid} onChange={(e) => onPaidChange(e.target.value)} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-admin-soft/60 rounded-lg p-4">
        <div>
          <div className="text-xs text-admin-muted uppercase tracking-wide">Total</div>
          <div className="text-lg font-semibold text-gray-900">{formatMoney(fin.total_amount)}</div>
        </div>
        <div>
          <div className="text-xs text-admin-muted uppercase tracking-wide">Balance</div>
          <div className="text-lg font-semibold text-gray-900">{formatMoney(fin.balance)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField label="Order Status">
          <select className={inputClass()} value={form.status} onChange={(e) => set('status', e.target.value)}>
            {ORDER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </FormField>
        <FormField label="Payment Status">
          <select className={inputClass()} value={form.payment_status} onChange={(e) => set('payment_status', e.target.value)}>
            {PAYMENT_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </FormField>
      </div>
    </>
  );
}

export function sliceDate(v) {
  return v ? String(v).slice(0, 10) : '';
}

export function applyApiErrors(err) {
  const data = err.response?.data;
  if (data?.errors) return { ...data.errors, general: data.message };
  return { general: data?.message || 'Save failed.' };
}
