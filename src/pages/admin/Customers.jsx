import { useState, useEffect, useCallback } from 'react';
import ConfirmDialog from '../../components/admin/ConfirmDialog.jsx';
import FormField, { inputClass } from '../../components/admin/FormField.jsx';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import { CustomerApi } from '../../api/CustomerApi.js';
import { formatMoney } from '../../utils/pricing.js';

function CustomerForm({ customer, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: customer?.address || '',
    notes: customer?.notes || '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Customer name is required.';
    if (!form.phone.trim()) e.phone = 'Phone number is required.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      if (customer) await CustomerApi.update(customer.id, form);
      else await CustomerApi.create(form);
      onSaved();
    } catch (err) {
      const data = err.response?.data;
      setErrors(data?.errors ? { ...data.errors, general: data.message } : { general: data?.message || 'Save failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
          <h2 className="text-lg font-semibold text-gray-900">{customer ? 'Edit Customer' : 'New Customer'}</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && <div className="text-red-600 text-sm bg-red-50 border border-red-200 px-4 py-3 rounded-lg">{errors.general}</div>}
          <FormField label="Name" error={errors.name} required>
            <input className={inputClass(errors.name)} value={form.name} onChange={(e) => set('name', e.target.value)} />
          </FormField>
          <FormField label="Phone" error={errors.phone} required>
            <input className={inputClass(errors.phone)} value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </FormField>
          <FormField label="Email" error={errors.email}>
            <input type="email" className={inputClass(errors.email)} value={form.email} onChange={(e) => set('email', e.target.value)} />
          </FormField>
          <FormField label="Address">
            <textarea className={inputClass()} rows={2} value={form.address} onChange={(e) => set('address', e.target.value)} />
          </FormField>
          <FormField label="Notes">
            <textarea className={inputClass()} rows={2} value={form.notes} onChange={(e) => set('notes', e.target.value)} />
          </FormField>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="flex-1 bg-admin-primary text-white text-sm py-2.5 rounded-lg hover:bg-admin-primary-dark disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="px-6 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CustomerDetail({ customerId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    CustomerApi.get(customerId)
      .then((res) => setData(res.data.data))
      .catch(() => setError('Failed to load customer.'))
      .finally(() => setLoading(false));
  }, [customerId]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-y-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
          <h2 className="text-lg font-semibold text-gray-900">Customer Details</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="p-6">
          {loading && <p className="text-sm text-gray-400 text-center py-8">Loading...</p>}
          {error && <p className="text-sm text-red-600 text-center py-8">{error}</p>}
          {data && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-xs text-admin-muted uppercase">Name</div>
                  <div className="font-medium text-gray-900">{data.name}</div>
                </div>
                <div>
                  <div className="text-xs text-admin-muted uppercase">Phone</div>
                  <div className="text-gray-800">{data.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-admin-muted uppercase">Email</div>
                  <div className="text-gray-800">{data.email || '—'}</div>
                </div>
                <div>
                  <div className="text-xs text-admin-muted uppercase">Address</div>
                  <div className="text-gray-800">{data.address || '—'}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs text-admin-muted uppercase">Notes</div>
                  <div className="text-gray-800 whitespace-pre-wrap">{data.notes || '—'}</div>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-gray-900 mb-3">Order History</h3>
              {!data.orders?.length ? (
                <p className="text-sm text-gray-400">No orders for this customer.</p>
              ) : (
                <div className="overflow-x-auto border border-admin-border rounded-lg">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        {['Order #', 'Service', 'Status', 'Payment', 'Total', 'Date'].map((h) => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase px-3 py-2">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.orders.map((o) => (
                        <tr key={`${o.service_type}-${o.id}`} className="border-b border-gray-50">
                          <td className="px-3 py-2 font-mono text-xs">{o.order_number}</td>
                          <td className="px-3 py-2 capitalize text-xs">{String(o.service_type).replace('_', ' ')}</td>
                          <td className="px-3 py-2"><StatusBadge status={o.status} /></td>
                          <td className="px-3 py-2"><StatusBadge status={o.payment_status} type="payment" /></td>
                          <td className="px-3 py-2">{formatMoney(o.total_amount)}</td>
                          <td className="px-3 py-2 text-xs text-gray-500">{o.created_at ? new Date(o.created_at).toLocaleDateString() : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewId, setViewId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    CustomerApi.list(search)
      .then((res) => setCustomers(res.data.data || []))
      .catch(() => setError('Failed to load.'))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await CustomerApi.delete(deleteTarget.id);
      if (res.data.success) { setDeleteTarget(null); load(); }
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot delete this customer.');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-admin-muted mt-0.5">Customer records and order history</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-admin-primary hover:bg-admin-primary-dark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          + New Customer
        </button>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

      <div className="bg-white rounded-xl shadow-admin border border-admin-border">
        <div className="p-4 border-b border-admin-border">
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-admin-primary/30 focus:border-admin-primary"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-admin-border">
                {['Name', 'Phone', 'Email', 'Notes', 'Added'].map((col) => (
                  <th key={col} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">{col}</th>
                ))}
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center text-gray-400 py-12">Loading...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-gray-400 py-12">No customers found.</td></tr>
              ) : customers.map((c) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                  <td className="px-4 py-3 text-gray-500">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">{c.notes || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setViewId(c.id)} className="text-xs text-admin-primary hover:text-admin-primary-dark font-medium">View</button>
                      <button type="button" onClick={() => { setEditing(c); setShowForm(true); }} className="text-xs text-admin-primary hover:text-admin-primary-dark font-medium">Edit</button>
                      <button type="button" onClick={() => setDeleteTarget(c)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && <CustomerForm customer={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />}
      {viewId && <CustomerDetail customerId={viewId} onClose={() => setViewId(null)} />}
      {deleteTarget && (
        <ConfirmDialog
          message={`Are you sure you want to delete customer "${deleteTarget.name}"? This cannot be undone if they have no orders.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
