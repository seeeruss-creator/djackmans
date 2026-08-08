import { Link } from 'react-router-dom';

export default function ServicePageLayout({ banner, title, subtitle, eyebrow, children }) {
  return (
    <div className="bg-brand-black min-h-screen">
      {/* Banner */}
      <div className="relative h-[50vh] min-h-[320px] overflow-hidden">
        <img src={banner} alt={title} className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-end pb-12 px-6">
          <div className="max-w-4xl mx-auto w-full">
            <p className="section-eyebrow mb-3">{eyebrow}</p>
            <h1 className="font-serif text-4xl lg:text-5xl text-brand-cream font-bold">{title}</h1>
            {subtitle && <p className="font-serif italic text-brand-cream/70 text-xl mt-2">{subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {children}
        <div className="mt-14 text-center">
          <p className="section-eyebrow mb-4">Interested?</p>
          <Link to="/appointment" className="btn-bronze">
            Book an Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
