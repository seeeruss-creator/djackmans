import heroBg from '../../assets/images/storefront.png';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-[88vh] flex flex-col overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: 0.35 }}
        />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-brand-black to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-black to-transparent" />
        <div className="absolute inset-0 bg-brand-black/40" />
      </div>

      <div className="absolute left-6 top-12 bottom-16 w-px bg-gradient-to-b from-transparent via-brand-gold/50 to-transparent hidden lg:block" />

      <div className="relative flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-14 py-24">
          <div className="max-w-3xl">
            <div className="opacity-0 animate-fade-in-up flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-brand-gold" />
              <span className="section-eyebrow">Premium Tailoring</span>
            </div>

            <h1 className="opacity-0 animate-fade-in-up-delay font-serif leading-tight mb-5">
              <span className="block text-gold-gradient font-bold text-5xl sm:text-6xl lg:text-7xl tracking-wide">
                D JACKMAN
              </span>
            </h1>

            <p className="opacity-0 animate-fade-in-up-delay2 text-brand-cream/85 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed font-sans">
              Professional Tailoring & Garment Services
            </p>

            <div className="opacity-0 animate-fade-in-up-delay2 flex flex-wrap gap-4">
              <a href="#services" className="btn-bronze">
                Explore Services
              </a>
              <a href="#contact" className="btn-outlined">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-bronze-gradient overflow-hidden py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {['TAILORING', 'RENTAL', 'CUSTOMIZATION', 'REPAIR', 'DRY CLEANING', 'TAILORING', 'RENTAL', 'CUSTOMIZATION', 'REPAIR', 'DRY CLEANING'].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 mx-6 text-brand-cream/90 font-sans font-semibold tracking-[0.2em] uppercase text-xs">
              {item}
              <span className="text-brand-cream/50">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
