import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardApi } from '../../api/DashboardApi.js';
import StatusBadge from '../../components/admin/StatusBadge.jsx';
import { getUser } from '../../utils/auth.js';

const CHART_KEYS = [
  { key: 'received', label: 'Received', color: 'bg-stone-400', hex: '#A8A29E' },
  { key: 'in_progress', label: 'In Progress', color: 'bg-amber-600', hex: '#B97A3C' },
  { key: 'ready_for_pickup', label: 'Ready', color: 'bg-yellow-500', hex: '#C9A15A' },
  { key: 'completed', label: 'Completed', color: 'bg-emerald-600', hex: '#2F7D5B' },
  { key: 'cancelled', label: 'Cancelled', color: 'bg-rose-400', hex: '#C86A6A' },
];

const SERVICE_ICONS = {
  Rental: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
  Customization: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  Repair: 'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085',
  'Dry Cleaning': 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function Donut({ segments, total }) {
  if (!total) {
    return (
      <div className="relative h-36 w-36 shrink-0 rounded-full bg-admin-soft flex items-center justify-center">
        <div className="h-24 w-24 rounded-full bg-admin-panel flex items-center justify-center text-xs text-admin-muted">
          No data
        </div>
      </div>
    );
  }
  let acc = 0;
  const stops = segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const from = (acc / total) * 360;
      acc += s.value;
      const to = (acc / total) * 360;
      return `${s.hex} ${from}deg ${to}deg`;
    })
    .join(', ');

  return (
    <div
      className="relative h-36 w-36 shrink-0 rounded-full shadow-admin"
      style={{ background: `conic-gradient(${stops})` }}
    >
      <div className="absolute inset-[14px] rounded-full bg-admin-panel flex flex-col items-center justify-center">
        <span className="font-serif text-2xl font-semibold text-admin-text leading-none">{total}</span>
        <span className="text-[9px] uppercase tracking-[0.18em] text-admin-muted mt-1">orders</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const user = getUser();
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
    return (
      <div className="py-24 text-center">
        <div className="inline-block h-8 w-8 rounded-full border-2 border-admin-border border-t-admin-primary animate-spin" />
        <p className="text-admin-muted text-sm mt-4 tracking-wide">Preparing your atelier…</p>
      </div>
    );
  }
  if (error) {
    return <div className="text-rose-600 text-sm py-20 text-center">{error}</div>;
  }
  if (!stats) {
    return <div className="text-admin-muted text-sm py-20 text-center">No dashboard data available.</div>;
  }

  const chart = stats.chart || [];

  const statusTotals = CHART_KEYS.map(({ key, label, hex }) => ({
    key,
    label,
    hex,
    value: chart.reduce((s, row) => s + (Number(row[key]) || 0), 0),
  }));
  const statusGrand = statusTotals.reduce((s, x) => s + x.value, 0);

  const completionRate = statusGrand
    ? Math.round(((statusTotals.find((s) => s.key === 'completed')?.value || 0) / statusGrand) * 100)
    : 0;

  const serviceCards = [
    { label: 'Rental', value: stats.totalRentOrders, to: '/admin/rental-orders' },
    { label: 'Customization', value: stats.totalCustomizationOrders, to: '/admin/customization-orders' },
    { label: 'Repair', value: stats.totalRepairOrders, to: '/admin/repair-orders' },
    { label: 'Dry Cleaning', value: stats.totalDryCleaningOrders, to: '/admin/dry-cleaning-orders' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Hero band ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-admin-sidebar text-brand-cream shadow-admin-lg">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              'radial-gradient(ellipse 60% 90% at 85% 10%, rgba(201,161,90,0.28) 0%, transparent 55%), radial-gradient(ellipse 45% 70% at 10% 100%, rgba(140,90,43,0.35) 0%, transparent 60%)',
          }}
        />
        <div
          className="absolute inset-y-0 right-10 hidden lg:flex items-center font-serif text-[180px] leading-none text-brand-gold/[0.07] select-none pointer-events-none"
          aria-hidden="true"
        >
          J
        </div>

        <div className="relative px-6 sm:px-9 py-8 sm:py-10">
          <p className="text-[10px] tracking-[0.28em] uppercase text-brand-gold/90 font-semibold mb-2">
            {today}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight">
            {greeting()}, <span className="text-gold-gradient">{(user?.name || 'Admin').split(' ')[0]}</span>
          </h1>
          <p className="text-sm text-brand-cream/50 mt-2 max-w-md">
            Here's what's moving through the atelier today.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 sm:gap-0 sm:flex sm:items-stretch sm:divide-x sm:divide-white/10">
            <div className="sm:pr-10">
              <div className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums">
                {stats.totalOrders ?? 0}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-brand-cream/45 mt-2">Total Orders</div>
            </div>
            <div className="sm:px-10">
              <div className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums text-brand-gold">
                {stats.pendingOrders ?? 0}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-brand-cream/45 mt-2">In the Works</div>
            </div>
            <div className="sm:px-10">
              <div className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight tabular-nums">
                {completionRate}<span className="text-2xl align-top">%</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-brand-cream/45 mt-2">Completion</div>
            </div>
          </div>
        </div>
        <div className="relative h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      </div>

      {/* ── Service cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {serviceCards.map(({ label, value, to }) => (
          <Link
            key={label}
            to={to}
            className="group admin-card relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-admin-lg"
          >
            <div className="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-brand-gold/0 to-transparent group-hover:via-brand-gold/60 transition-all duration-500" />
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-xl bg-admin-soft text-admin-primary flex items-center justify-center group-hover:bg-bronze-gradient group-hover:text-brand-cream transition-all duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                  <path strokeLinecap="round" strokeLinejoin="round" d={SERVICE_ICONS[label]} />
                </svg>
              </div>
              <svg
                className="w-4 h-4 text-admin-muted/40 group-hover:text-admin-primary group-hover:translate-x-0.5 transition-all"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="mt-4 font-serif text-3xl font-semibold text-admin-text tabular-nums">{value ?? 0}</div>
            <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-admin-muted mt-1">
              {label}
            </div>
          </Link>
        ))}
      </div>

      {/* ── Charts + recent ───────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <div className="xl:col-span-3 admin-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="font-serif text-lg font-semibold text-admin-text mb-1">Orders by Service</h2>
              <p className="text-xs text-admin-muted mb-6">Status mix per service line</p>

              {chart.length === 0 ? (
                <p className="text-sm text-admin-muted py-10 text-center">No chart data yet.</p>
              ) : (
                <div className="space-y-5">
                  {chart.map((row) => {
                    const total = CHART_KEYS.reduce((s, { key }) => s + (Number(row[key]) || 0), 0);
                    return (
                      <div key={row.type}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-admin-text">{row.type}</span>
                          <span className="text-admin-muted tabular-nums">{total}</span>
                        </div>
                        <div className="h-2 rounded-full bg-admin-soft overflow-hidden flex">
                          {total > 0 &&
                            CHART_KEYS.map(({ key, color }) => {
                              const n = Number(row[key]) || 0;
                              if (!n) return null;
                              return (
                                <div
                                  key={key}
                                  className={`${color} h-full transition-all duration-700`}
                                  style={{ width: `${(n / total) * 100}%` }}
                                  title={`${key}: ${n}`}
                                />
                              );
                            })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex sm:flex-col items-center gap-5 shrink-0 sm:pt-2">
              <Donut segments={statusTotals} total={statusGrand} />
              <div className="space-y-1.5">
                {statusTotals.map(({ key, label, hex, value }) => (
                  <div key={key} className="flex items-center gap-2 text-xs text-admin-muted">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: hex }} />
                    <span className="flex-1">{label}</span>
                    <span className="tabular-nums font-medium text-admin-text">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 admin-card p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-lg font-semibold text-admin-text">Recent Orders</h2>
            <Link to="/admin/rental-orders" className="text-xs text-admin-primary font-semibold hover:underline">
              View all
            </Link>
          </div>
          {!stats.recentOrders?.length ? (
            <p className="text-sm text-admin-muted py-10 text-center">No recent orders.</p>
          ) : (
            <ul className="space-y-1 flex-1">
              {stats.recentOrders.map((o) => (
                <li
                  key={`${o.service_type}-${o.id}`}
                  className="flex items-start justify-between gap-3 rounded-xl px-3 py-3 hover:bg-admin-soft/70 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-admin-text truncate">{o.order_number}</div>
                    <div className="text-xs text-admin-muted truncate mt-0.5">
                      {o.customer_name} · {o.service_label}
                    </div>
                    <div className="text-[10px] text-admin-muted/70 mt-1">
                      {o.created_at ? new Date(o.created_at).toLocaleString() : ''}
                    </div>
                  </div>
                  <div className="shrink-0 pt-0.5">
                    <StatusBadge status={o.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
