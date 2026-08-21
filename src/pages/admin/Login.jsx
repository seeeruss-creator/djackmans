import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { AuthApi } from '../../api/AuthApi.js';
import { getToken, setToken, setUser } from '../../utils/auth.js';
import logoImg from '../../assets/images/logo.png';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (getToken()) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await AuthApi.login(form.username.trim(), form.password);
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.request && !err.response
          ? 'Cannot reach the API. Check that the site is deployed with Netlify Functions enabled.'
          : 'Login failed. Please try again.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logoImg} alt="D Jackman logo" className="h-14 w-auto mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-gray-900">D Jackman</h1>
          <p className="text-admin-primary text-xs tracking-[0.2em] uppercase font-semibold mt-1">Admin Login</p>
        </div>

        <div className="bg-white rounded-xl shadow-admin border border-admin-border p-8">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Username or Email
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-black outline-none focus:ring-2 focus:ring-admin-primary/30 focus:border-admin-primary"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pr-12 text-sm text-black outline-none focus:ring-2 focus:ring-admin-primary/30 focus:border-admin-primary"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-admin-muted hover:text-gray-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-admin-primary hover:bg-admin-primary-dark text-white text-sm font-semibold py-2.5 rounded-lg disabled:opacity-50 transition-colors"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-admin-muted mt-6">
            Default login: <span className="font-medium text-gray-700">admin</span> / <span className="font-medium text-gray-700">admin123</span>
          </p>
          <p className="text-center text-xs text-admin-muted mt-2">
            <Link to="/" className="text-admin-primary hover:underline">Back to website</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
