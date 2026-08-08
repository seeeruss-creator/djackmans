import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../../utils/auth.js';

export default function ProtectedRoute() {
  if (!getToken()) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
