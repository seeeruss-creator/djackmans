import { useState, useEffect, useCallback } from 'react';
import { DashboardApi } from '../../api/DashboardApi.js';
import { formatMoney } from '../../utils/pricing.js';
import { STATUS_LABELS } from '../../constants/statuses.js';

const RANGES = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'custom', label: 'Custom' },
];

const SERVICE_LABELS = {
  rental: 'Rental',
  customization: 'Customization',
  repair: 'Repair',
  dry_cleaning: 'Dry Cleaning',
};

export default function Reports() {
  const [range, setRange] = useState('month');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    const params = range === 'custom'
      ? { from: from || undefined, to: to || undefined }
      : { range };
    DashboardApi.reports(params)
      .then((res) => setData(res.data.data))
      .catch(() => setError('Failed to load reports.'))
      .finally(() => setLoading(false));
  }, [range, from, to]);

  useEffect(() => {
    if (range === 'custom' && (!from || !to)) {
      setLoading(false);
      return;
    }
    load();
  }, [load, range, from, to]);

  const cards = data
    ? [
        { label: 'Total Orders', value: data.totalOrders ?? 0 },
        { label: 'Revenue', value: formatMoney(data.revenue) },
        { label: 'Paid', value: formatMoney(data.paidAmount) },
        { label: 'Outstanding', value: formatMoney(data.outstandingBalance) },
        { label: 'Completed', value: data.completedOrders ?? 0 },
        { label: 'Pending', value: data.pendingOrders ?? 0 },
        { label: 'Cancelled', value: data.cancelledOrders ?? 0 },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="admin-page-title">Reports</h1>
        <p className="admin-page-sub">Order and revenue summary</p>
      </div>

      <div className="admin-card p-4 flex flex-col lg:flex-row gap-3 lg:items-end">
        <div className="flex flex-wrap gap-2">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              onClick={() => setRange(r.key)}
              className={`px-3.5 py-2 text-sm rounded-xl font-medium transition-colors ${
                range === r.key
                  ? 'bg-bronze-gradient text-brand-cream shadow-admin'
                  : 'bg-admin-soft text-admin-text hover:bg-admin-border/70'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        {range === 'custom' && (
          <div className="flex flex-wrap gap-2 items-end">
            <div>
              <label className="block text-xs text-admin-muted mb-1">From</label>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-admin-muted mb-1">To</label>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <button
              type="button"
              onClick={load}
              disabled={!from || !to}
              className="bg-admin-primary text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}

      {loading ? (
        <div className="text-center text-admin-muted py-12 text-sm">Loading reports...</div>
      ) : !data ? (
        <div className="text-center text-admin-muted py-12 text-sm">
          {range === 'custom' ? 'Select a date range to view reports.' : 'No report data available.'}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {cards.map(({ label, value }) => (
              <div key={label} className="admin-card p-4">
                <div className="text-[10px] text-admin-muted uppercase tracking-[0.14em] mb-2 font-semibold">{label}</div>
                <div className="font-serif text-2xl font-semibold text-admin-text">{value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="admin-card p-5">
              <h2 className="font-serif text-lg font-semibold text-admin-text mb-4">By Service</h2>
              <ul className="space-y-3">
                {Object.entries(data.ordersByServiceType || {}).map(([key, count]) => (
                  <li key={key} className="flex justify-between text-sm border-b border-admin-border pb-2">
                    <span className="text-admin-text/80">{SERVICE_LABELS[key] || key}</span>
                    <span className="font-semibold text-admin-text">{count}</span>
                  </li>
                ))}
                {!Object.keys(data.ordersByServiceType || {}).length && (
                  <li className="text-sm text-admin-muted">No data</li>
                )}
              </ul>
            </div>
            <div className="admin-card p-5">
              <h2 className="font-serif text-lg font-semibold text-admin-text mb-4">By Status</h2>
              <ul className="space-y-3">
                {Object.entries(data.ordersByStatus || {}).map(([key, count]) => (
                  <li key={key} className="flex justify-between text-sm border-b border-admin-border pb-2">
                    <span className="text-admin-text/80">{STATUS_LABELS[key] || key.replace(/_/g, ' ')}</span>
                    <span className="font-semibold text-admin-text">{count}</span>
                  </li>
                ))}
                {!Object.keys(data.ordersByStatus || {}).length && (
                  <li className="text-sm text-admin-muted">No data</li>
                )}
              </ul>
            </div>
          </div>

          {(data.from || data.to) && (
            <p className="text-xs text-admin-muted">
              Period: {data.from || '—'} to {data.to || '—'}
            </p>
          )}
        </>
      )}
    </div>
  );
}
