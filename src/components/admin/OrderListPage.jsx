import { useState, useEffect, useCallback, useMemo } from 'react';
import StatusBadge from './StatusBadge.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { ORDER_STATUSES, PAYMENT_STATUSES } from '../../constants/statuses.js';
import { formatMoney } from '../../utils/pricing.js';

const PAGE_SIZE = 10;

export default function OrderListPage({
  title,
  columns,
  api,
  FormComponent,
  renderRow,
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    api.list({
      search,
      status,
      payment_status: paymentStatus,
    })
      .then((res) => setOrders(res.data.data || []))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, [search, status, paymentStatus, api]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [search, status, paymentStatus]);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const pageOrders = useMemo(
    () => orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [orders, page]
  );

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(deleteTarget.id);
      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete order.');
    } finally {
      setDeleting(false);
    }
  };

  const colSpan = columns.length + 4;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-admin-muted mt-0.5">Manage and update orders</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditingOrder(null); setShowForm(true); }}
          className="bg-admin-primary hover:bg-admin-primary-dark text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          + Add Order
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-admin border border-admin-border">
        <div className="flex flex-col lg:flex-row gap-3 p-4 border-b border-admin-border">
          <input
            type="text"
            placeholder="Search by order #, customer name, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-admin-primary/30 focus:border-admin-primary"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-admin-primary/30"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-admin-primary/30"
          >
            <option value="">All Payments</option>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-admin-border">
                {columns.map((col) => (
                  <th key={col} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                    {col}
                  </th>
                ))}
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Payment</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={colSpan} className="text-center text-gray-400 py-12">Loading...</td></tr>
              ) : pageOrders.length === 0 ? (
                <tr><td colSpan={colSpan} className="text-center text-gray-400 py-12">No orders found.</td></tr>
              ) : (
                pageOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                    {renderRow(order, { formatMoney })}
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3"><StatusBadge status={order.payment_status} type="payment" /></td>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => { setEditingOrder(order); setShowForm(true); }}
                          className="text-xs text-admin-primary hover:text-admin-primary-dark font-medium"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(order)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && orders.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-admin-border text-sm text-gray-600">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, orders.length)} of {orders.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                Prev
              </button>
              <span className="px-2 py-1.5">{page} / {totalPages}</span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <FormComponent
          order={editingOrder}
          onClose={() => { setShowForm(false); setEditingOrder(null); }}
          onSaved={() => { setShowForm(false); setEditingOrder(null); load(); }}
          api={api}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Are you sure you want to delete order ${deleteTarget.order_number}? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
