import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/images/logo.png';

const links = [
  { href: '#home', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-brand-cream/95 backdrop-blur sticky top-0 z-50 shadow-sm border-b border-brand-gold/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-3 shrink-0">
          <img src={logoImg} alt="D Jackman logo" className="h-10 w-auto object-contain" />
          <span className="hidden sm:block leading-tight">
            <span className="block font-serif font-bold text-brand-ink text-sm tracking-widest uppercase">D Jackman</span>
            <span className="block font-sans text-[10px] tracking-[0.2em] uppercase text-brand-bronze font-medium">Tailoring</span>
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-7">
          {links.map(({ href, label }) => (
            <a key={href} href={href} className="nav-link text-brand-ink">
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/login" className="btn-bronze shrink-0 !px-5 !py-2.5">
            Admin Login
          </Link>
          <button
            type="button"
            className="lg:hidden p-2 text-brand-ink"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-brand-gold/10 bg-brand-cream px-6 py-4 space-y-3">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="block text-brand-ink font-sans text-sm tracking-widest uppercase py-2"
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
