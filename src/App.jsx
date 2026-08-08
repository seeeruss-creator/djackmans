import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import Home from './pages/public/Home.jsx';
import Login from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import RentOrders from './pages/admin/RentOrders.jsx';
import CustomizationOrders from './pages/admin/CustomizationOrders.jsx';
import RepairOrders from './pages/admin/RepairOrders.jsx';
import DryCleaningOrders from './pages/admin/DryCleaningOrders.jsx';
import Customers from './pages/admin/Customers.jsx';
import Reports from './pages/admin/Reports.jsx';
import Settings from './pages/admin/Settings.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="/login" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<Login />} />

      {/* Legacy redirects */}
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/rent-orders" element={<Navigate to="/admin/rental-orders" replace />} />
      <Route path="/rental-orders" element={<Navigate to="/admin/rental-orders" replace />} />
      <Route path="/customization-orders" element={<Navigate to="/admin/customization-orders" replace />} />
      <Route path="/repair-orders" element={<Navigate to="/admin/repair-orders" replace />} />
      <Route path="/dry-cleaning-orders" element={<Navigate to="/admin/dry-cleaning-orders" replace />} />
      <Route path="/customers" element={<Navigate to="/admin/customers" replace />} />
      <Route path="/users" element={<Navigate to="/admin/settings" replace />} />
      <Route path="/appointment" element={<Navigate to="/" replace />} />
      <Route path="/rental" element={<Navigate to="/" replace />} />
      <Route path="/customize" element={<Navigate to="/" replace />} />
      <Route path="/repair" element={<Navigate to="/" replace />} />
      <Route path="/dry-cleaning" element={<Navigate to="/" replace />} />

      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rental-orders" element={<RentOrders />} />
          <Route path="customization-orders" element={<CustomizationOrders />} />
          <Route path="repair-orders" element={<RepairOrders />} />
          <Route path="dry-cleaning-orders" element={<DryCleaningOrders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
