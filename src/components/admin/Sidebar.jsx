import { NavLink, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../../utils/auth.js';
import { useSidebar } from '../../layouts/AdminLayout.jsx';
import logoImg from '../../assets/images/logo.png';

const Icon = ({ d, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const mainNav = [
  { to: '/admin/dashboard', label: 'Dashboard', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z' },
  { to: '/admin/rental-orders', label: 'Rental Orders', d: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { to: '/admin/customization-orders', label: 'Customization Orders', d: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { to: '/admin/repair-orders', label: 'Repair Orders', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  { to: '/admin/dry-cleaning-orders', label: 'Dry Cleaning Orders', d: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  { to: '/admin/customers', label: 'Customers', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { to: '/admin/reports', label: 'Reports', d: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
];

export default function Sidebar() {
  const user = getUser();
  const navigate = useNavigate();
  const { open, setOpen } = useSidebar();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg mb-0.5 transition-colors ${
      isActive
        ? 'bg-admin-soft text-admin-primary font-semibold'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-admin-border flex flex-col h-full transition-transform duration-200 ${
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="px-5 py-5 border-b border-admin-border flex items-center gap-3">
        <img src={logoImg} alt="D Jackman" className="h-9 w-auto object-contain" />
        <div className="min-w-0">
          <div className="text-gray-900 font-semibold text-sm leading-tight truncate">D Jackman</div>
          <div className="text-admin-primary text-[10px] tracking-wide uppercase font-medium">Admin Panel</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {mainNav.map(({ to, label, d }) => (
          <NavLink key={to} to={to} className={linkClass} onClick={() => setOpen(false)}>
            <Icon d={d} />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-admin-border space-y-1">
        <NavLink to="/admin/settings" className={linkClass} onClick={() => setOpen(false)}>
          <Icon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <span>Settings</span>
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Icon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          <span>Logout</span>
        </button>
        <div className="px-3 pt-3 text-xs text-gray-400">
          <div className="text-gray-600 truncate font-medium">{user?.name}</div>
          <div className="uppercase tracking-wider text-[9px]">{user?.role}</div>
        </div>
      </div>
    </aside>
  );
}
