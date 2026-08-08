import { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar.jsx';
import AdminHeader from '../components/admin/AdminHeader.jsx';

const SidebarCtx = createContext({ open: false, setOpen: () => {} });
export const useSidebar = () => useContext(SidebarCtx);

export default function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <SidebarCtx.Provider value={{ open, setOpen }}>
      <div className="flex h-screen bg-admin-bg text-admin-text overflow-hidden font-sans">
        {open && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarCtx.Provider>
  );
}
