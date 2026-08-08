import logoImg from '../../assets/images/logo.png';

export default function Footer() {
  return (
    <footer className="bg-brand-ink border-t border-brand-gold/20 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logoImg} alt="D Jackman logo" className="h-10 w-auto object-contain opacity-90" />
            <div>
              <div className="font-serif font-bold text-brand-cream text-sm tracking-widest uppercase">D Jackman</div>
              <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-gold font-medium">Tailoring</div>
            </div>
          </div>
          <p className="text-brand-cream/60 text-sm leading-relaxed">
            Professional tailoring, garment rental, customization, repair, and dry cleaning.
          </p>
        </div>

        <div>
          <h4 className="section-eyebrow mb-4">Visit Us</h4>
          <p className="text-brand-cream/70 text-sm leading-relaxed">
            [Your Street Address]<br />
            [City, Province]<br />
            Philippines
          </p>
          <p className="text-brand-cream/70 text-sm mt-3">
            Mon – Sat: [Hours]<br />
            Sunday: [Hours]
          </p>
        </div>

        <div>
          <h4 className="section-eyebrow mb-4">On This Page</h4>
          <ul className="space-y-2">
            {[
              ['Home', '#home'],
              ['Services', '#services'],
              ['About', '#about'],
              ['Contact', '#contact'],
            ].map(([label, href]) => (
              <li key={href}>
                <a href={href} className="text-brand-cream/60 hover:text-brand-gold text-sm tracking-wide transition-colors">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-brand-gold/10 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-brand-cream/40 text-xs tracking-widest uppercase">
          &copy; {new Date().getFullYear()} D Jackman Tailoring. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
