import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../../utils/auth.js';
import logoImg from '../../assets/images/logo.png';

export default function Settings() {
  const user = getUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-admin-muted mt-1">Account and session</p>
      </div>

      <div className="bg-white rounded-xl border border-admin-border shadow-admin p-6">
        <div className="flex items-center gap-4 mb-6">
          <img src={logoImg} alt="D Jackman" className="h-12 w-auto object-contain" />
          <div>
            <div className="font-semibold text-gray-900">D Jackman</div>
            <div className="text-xs text-admin-primary uppercase tracking-wide">Admin Panel</div>
          </div>
        </div>

        <h2 className="text-sm font-semibold text-gray-900 mb-3">Profile</h2>
        <dl className="space-y-3 text-sm mb-6">
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <dt className="text-admin-muted">Name</dt>
            <dd className="font-medium text-gray-900">{user?.name || '—'}</dd>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <dt className="text-admin-muted">Username</dt>
            <dd className="font-medium text-gray-900">{user?.username || '—'}</dd>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <dt className="text-admin-muted">Email</dt>
            <dd className="font-medium text-gray-900">{user?.email || '—'}</dd>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <dt className="text-admin-muted">Role</dt>
            <dd className="font-medium text-gray-900 capitalize">{user?.role || '—'}</dd>
          </div>
        </dl>

        <p className="text-xs text-admin-muted mb-4">
          To change your password, ask a system administrator to update your user account, or use the Users management tools if available.
        </p>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
