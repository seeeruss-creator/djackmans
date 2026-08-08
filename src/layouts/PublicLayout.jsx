import { Outlet } from 'react-router-dom';
import Navbar from '../components/public/Navbar.jsx';
import Footer from '../components/public/Footer.jsx';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-black text-brand-cream">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
