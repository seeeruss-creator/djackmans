import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthApi } from '../../api/AuthApi.js';
import { getUser, logout } from '../../utils/auth.js';
import logoImg from '../../assets/images/logo.png';

export default function Settings() {
  const user = getUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await AuthApi.changePassword(form.currentPassword, form.newPassword);
      setSuccess(res.data.message || 'Password updated successfully.');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="admin-page-title">Settings</h1>
        <p className="admin-page-sub">Account and security</p>
      </div>

      <div className="admin-card p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          <img src={logoImg} alt="D Jackman" className="h-12 w-auto object-contain" />
          <div>
            <div className="font-serif font-semibold text-admin-text text-lg">D Jackman</div>
            <div className="text-[10px] text-admin-primary uppercase tracking-[0.2em]">Admin Panel</div>
          </div>
        </div>

        <h2 className="text-sm font-semibold text-admin-text mb-3">Profile</h2>
        <dl className="space-y-3 text-sm mb-8">
          <div className="flex justify-between border-b border-admin-border pb-2">
            <dt className="text-admin-muted">Name</dt>
            <dd className="font-medium text-admin-text">{user?.name || '—'}</dd>
          </div>
          <div className="flex justify-between border-b border-admin-border pb-2">
            <dt className="text-admin-muted">Username</dt>
            <dd className="font-medium text-admin-text">{user?.username || '—'}</dd>
          </div>
          <div className="flex justify-between border-b border-admin-border pb-2">
            <dt className="text-admin-muted">Email</dt>
            <dd className="font-medium text-admin-text">{user?.email || '—'}</dd>
          </div>
          <div className="flex justify-between border-b border-admin-border pb-2">
            <dt className="text-admin-muted">Role</dt>
            <dd className="font-medium text-admin-text capitalize">{user?.role || '—'}</dd>
          </div>
        </dl>

        <h2 className="text-sm font-semibold text-admin-text mb-1">Change Password</h2>
        <p className="text-xs text-admin-muted mb-4">
          Your email stays the same. After you save, only the new password will work at login.
        </p>

        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl">
            {success}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-admin-text mb-1.5">Current password</label>
            <div className="relative">
              <input
                type={show.current ? 'text' : 'password'}
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="w-full border border-admin-border rounded-xl px-4 py-2.5 pr-14 text-sm text-admin-text outline-none focus:ring-2 focus:ring-admin-primary/25 focus:border-admin-primary"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShow({ ...show, current: !show.current })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-admin-muted hover:text-admin-text"
              >
                {show.current ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-text mb-1.5">New password</label>
            <div className="relative">
              <input
                type={show.next ? 'text' : 'password'}
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full border border-admin-border rounded-xl px-4 py-2.5 pr-14 text-sm text-admin-text outline-none focus:ring-2 focus:ring-admin-primary/25 focus:border-admin-primary"
                autoComplete="new-password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShow({ ...show, next: !show.next })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-admin-muted hover:text-admin-text"
              >
                {show.next ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-text mb-1.5">Confirm new password</label>
            <div className="relative">
              <input
                type={show.confirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full border border-admin-border rounded-xl px-4 py-2.5 pr-14 text-sm text-admin-text outline-none focus:ring-2 focus:ring-admin-primary/25 focus:border-admin-primary"
                autoComplete="new-password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShow({ ...show, confirm: !show.confirm })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-admin-muted hover:text-admin-text"
              >
                {show.confirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn-primary"
          >
            {loading ? 'Saving...' : 'Update Password'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
