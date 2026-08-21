import { getUser } from '../../utils/auth.js';
import { useSidebar } from '../../layouts/AdminLayout.jsx';

export default function AdminHeader() {
  const user = getUser();
  const { setOpen } = useSidebar();

  const initial = (user?.name || 'A').trim().charAt(0).toUpperCase();

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-admin-panel/80 backdrop-blur-md border-b border-admin-border">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          className="lg:hidden p-2 rounded-xl text-admin-text hover:bg-admin-soft transition-colors"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="min-w-0">
          <div className="text-[10px] font-semibold tracking-[0.2em] uppercase text-admin-primary">
            Control Panel
          </div>
          <div className="text-sm font-medium text-admin-text truncate hidden sm:block">
            D Jackman Tailoring Management
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs text-admin-muted bg-admin-soft/70 border border-admin-border rounded-full px-3.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right leading-tight">
            <div className="text-sm font-medium text-admin-text truncate max-w-[160px]">
              {user?.name || 'Admin'}
            </div>
            <div className="text-[11px] text-admin-muted capitalize">{user?.role || 'admin'}</div>
          </div>
          <div className="h-9 w-9 rounded-full bg-bronze-gradient text-brand-cream text-sm font-semibold flex items-center justify-center shadow-admin ring-2 ring-white">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}
