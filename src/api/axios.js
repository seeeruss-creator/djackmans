import axios from 'axios';
import { getToken, logout } from '../utils/auth.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = String(err.config?.url || '');
    const isLoginRequest = url.includes('/auth/login');

    // Never redirect away from a failed login attempt — show the error instead.
    if (status === 401 && !isLoginRequest) {
      logout();
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
