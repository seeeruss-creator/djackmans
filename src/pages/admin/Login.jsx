import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { AuthApi } from '../../api/AuthApi.js';
import { getToken, setToken, setUser } from '../../utils/auth.js';
import logoImg from '../../assets/images/logo.png';
import heroBg from '../../assets/images/storefront.png';

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
          ? 'Cannot reach the API. Check that the backend is running.'
          : 'Login failed. Please try again.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-brand-black">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.35 }}
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-black to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent" />
        <div className="absolute inset-0 bg-brand-black/50" />
      </div>

      <div className="absolute left-6 top-12 bottom-16 w-px bg-gradient-to-b from-transparent via-brand-gold/50 to-transparent hidden lg:block" />

      <div className="relative w-full max-w-md opacity-0 animate-fade-in-up">
        <div className="text-center mb-8">
          <img src={logoImg} alt="D Jackman logo" className="h-16 w-auto mx-auto mb-5 object-contain drop-shadow-lg" />
          <h1 className="font-serif text-gold-gradient text-4xl font-bold tracking-wide">
            D JACKMAN
          </h1>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-brand-gold/60" />
            <p className="section-eyebrow">Admin Access</p>
            <div className="h-px w-8 bg-brand-gold/60" />
          </div>
        </div>

        <div className="rounded-2xl border border-brand-gold/20 bg-brand-ink/80 backdrop-blur-md shadow-[0_24px_80px_rgba(0,0,0,0.45)] p-8">
          {error && (
            <div className="mb-5 border border-red-400/30 bg-red-950/40 text-red-200 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium tracking-wide uppercase text-brand-cream/60 mb-2">
                Username or Email
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full rounded-xl border border-brand-gold/20 bg-brand-black/50 px-4 py-3 text-sm text-brand-cream placeholder:text-brand-cream/30 outline-none transition focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/20"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium tracking-wide uppercase text-brand-cream/60 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl border border-brand-gold/20 bg-brand-black/50 px-4 py-3 pr-14 text-sm text-brand-cream placeholder:text-brand-cream/30 outline-none transition focus:border-brand-gold/50 focus:ring-2 focus:ring-brand-gold/20"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-brand-gold/80 hover:text-brand-gold transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-bronze w-full !py-3 disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-brand-cream/45 mt-7">
            <Link to="/" className="text-brand-gold/90 hover:text-brand-gold transition-colors">
              Back to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
