import { getUser } from '../../utils/auth.js';
import { useSidebar } from '../../layouts/AdminLayout.jsx';

export default function AdminHeader() {
  const user = getUser();
  const { setOpen } = useSidebar();

  return (
    <header className="bg-admin-primary text-white h-14 flex items-center justify-between px-4 sm:px-6 shadow-sm shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          className="lg:hidden p-1.5 rounded-md hover:bg-white/10"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-w-0">
          <div className="text-[10px] sm:text-xs font-semibold tracking-[0.15em] uppercase opacity-90">
            Admin Control Panel
          </div>
          <div className="text-sm font-medium truncate hidden sm:block opacity-95">
            D Jackman — Tailoring Management
          </div>
        </div>
      </div>
      <div className="text-sm opacity-90 truncate max-w-[140px] sm:max-w-none">
        {user?.name || 'Admin'}
      </div>
    </header>
  );
}
