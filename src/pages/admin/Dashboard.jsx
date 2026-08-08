import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardApi } from '../../api/DashboardApi.js';
import StatusBadge from '../../components/admin/StatusBadge.jsx';

const CHART_KEYS = [
  { key: 'received', label: 'Received', color: 'bg-sky-400' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-indigo-500' },
  { key: 'ready_for_pickup', label: 'Ready', color: 'bg-violet-500' },
  { key: 'completed', label: 'Completed', color: 'bg-emerald-500' },
  { key: 'cancelled', label: 'Cancelled', color: 'bg-red-400' },
];

const SERVICE_LINKS = [
  { label: 'Rental', to: '/admin/rental-orders' },
  { label: 'Customization', to: '/admin/customization-orders' },
  { label: 'Repair', to: '/admin/repair-orders' },
  { label: 'Dry Cleaning', to: '/admin/dry-cleaning-orders' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    DashboardApi.stats()
      .then((res) => setStats(res.data.data))
      .catch(() => setError('Failed to load dashboard stats.'))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (loading) {
    return <div className="text-admin-muted text-sm py-16 text-center">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="text-red-600 text-sm py-16 text-center">{error}</div>;
  }
  if (!stats) {
    return <div className="text-admin-muted text-sm py-16 text-center">No dashboard data available.</div>;
  }

  const chart = stats.chart || [];

  const serviceCards = [
    { label: 'Rental', value: stats.totalRentOrders, to: '/admin/rental-orders', tone: 'bg-blue-50 text-blue-700' },
    { label: 'Customization', value: stats.totalCustomizationOrders, to: '/admin/customization-orders', tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Repair', value: stats.totalRepairOrders, to: '/admin/repair-orders', tone: 'bg-amber-50 text-amber-700' },
    { label: 'Dry Cleaning', value: stats.totalDryCleaningOrders, to: '/admin/dry-cleaning-orders', tone: 'bg-violet-50 text-violet-700' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-admin-muted mt-1">Overview of orders across all services</p>
        </div>
        <p className="text-sm text-admin-muted">{today}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-admin-primary text-white rounded-xl p-6 shadow-admin">
          <div className="text-sm font-medium opacity-90 mb-2">Total Orders</div>
          <div className="text-4xl font-bold">{stats.totalOrders ?? 0}</div>
        </div>
        <div className="bg-amber-400 text-amber-950 rounded-xl p-6 shadow-admin">
          <div className="text-sm font-medium opacity-90 mb-2">Pending Orders</div>
          <div className="text-4xl font-bold">{stats.pendingOrders ?? 0}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {serviceCards.map(({ label, value, to, tone }) => (
          <Link
            key={label}
            to={to}
            className="rounded-xl p-4 shadow-admin border border-admin-border bg-white hover:border-admin-primary/30 transition-colors"
          >
            <div className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full mb-3 ${tone}`}>{label}</div>
            <div className="text-2xl font-bold text-gray-900">{value ?? 0}</div>
            <div className="text-xs text-admin-muted mt-1">orders</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3 bg-white rounded-xl border border-admin-border shadow-admin p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Orders by Type & Status</h2>
          <p className="text-xs text-admin-muted mb-6">Stacked counts per service</p>
          {chart.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No chart data yet.</p>
          ) : (
            <div className="space-y-5">
              {chart.map((row) => {
                const total = CHART_KEYS.reduce((s, { key }) => s + (Number(row[key]) || 0), 0);
                return (
                  <div key={row.type}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-800">{row.type}</span>
                      <span className="text-admin-muted">{total}</span>
                    </div>
                    <div className="h-3 rounded-full bg-gray-100 overflow-hidden flex">
                      {total === 0 ? (
                        <div className="w-full h-full" />
                      ) : (
                        CHART_KEYS.map(({ key, color }) => {
                          const n = Number(row[key]) || 0;
                          if (!n) return null;
                          return (
                            <div
                              key={key}
                              className={`${color} h-full`}
                              style={{ width: `${(n / total) * 100}%` }}
                              title={`${key}: ${n}`}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="flex flex-wrap gap-3 pt-2">
                {CHART_KEYS.map(({ key, label, color }) => (
                  <div key={key} className="flex items-center gap-1.5 text-xs text-gray-600">
                    <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="xl:col-span-2 bg-white rounded-xl border border-admin-border shadow-admin p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/rental-orders" className="text-xs text-admin-primary font-medium hover:underline">
              View all
            </Link>
          </div>
          {!stats.recentOrders?.length ? (
            <p className="text-sm text-gray-400 py-8 text-center">No recent orders.</p>
          ) : (
            <ul className="space-y-3">
              {stats.recentOrders.map((o) => (
                <li
                  key={`${o.service_type}-${o.id}`}
                  className="flex items-start justify-between gap-3 border-b border-gray-50 pb-3 last:border-0"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{o.order_number}</div>
                    <div className="text-xs text-admin-muted truncate">
                      {o.customer_name} · {o.service_label}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      {o.created_at ? new Date(o.created_at).toLocaleString() : ''}
                    </div>
                  </div>
                  <div className="shrink-0">
                    <StatusBadge status={o.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {SERVICE_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className="text-[10px] uppercase tracking-wide text-admin-primary bg-admin-soft px-2 py-1 rounded-md"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
