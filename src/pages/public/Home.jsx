import Hero from '../../components/public/Hero.jsx';
import ServiceCard from '../../components/public/ServiceCard.jsx';
import placeholder from '../../assets/images/placeholder.svg';

const services = [
  {
    image: placeholder,
    title: 'Rental',
    description: 'Formal wear and special-occasion garments available for short-term rental, fitted and finished for your event.',
  },
  {
    image: placeholder,
    title: 'Customization',
    description: 'Made-to-measure garments tailored to your measurements, fabric choices, and design preferences.',
  },
  {
    image: placeholder,
    title: 'Repair',
    description: 'Alterations and garment repairs — from simple fixes to careful restoration of damaged pieces.',
  },
  {
    image: placeholder,
    title: 'Dry Cleaning',
    description: 'Professional cleaning and finishing for delicate fabrics and everyday garments that need expert care.',
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      <section id="services" className="py-20 px-6 bg-brand-ink">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-eyebrow mb-3">What We Offer</p>
            <h2 className="font-serif text-3xl lg:text-4xl text-brand-cream font-semibold">
              Our <span className="text-gold-gradient">Services</span>
            </h2>
            <div className="mt-4 mx-auto w-16 h-px bg-brand-gold/40" />
            <p className="mt-4 text-brand-cream/60 text-sm max-w-xl mx-auto">
              Visit us or get in touch to discuss your garment needs. Orders are handled by our staff in-store.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((s) => (
              <ServiceCard key={s.title} {...s} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-6 bg-brand-black relative">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #C9A15A 0%, transparent 50%)' }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <p className="section-eyebrow mb-3">Our Story</p>
          <h2 className="font-serif text-3xl lg:text-4xl text-brand-cream font-semibold mb-6">
            About <span className="text-gold-gradient">D Jackman</span>
          </h2>
          <div className="mx-auto w-16 h-px bg-brand-gold/40 mb-8" />
          <p className="text-brand-cream/70 text-base leading-relaxed mb-4">
            D Jackman provides professional tailoring and garment services — rental, customization, repair, and dry cleaning — with careful attention to fit, fabric, and finish.
          </p>
          <p className="text-brand-cream/60 text-sm leading-relaxed">
            Whether you need formal wear for an occasion, a custom-made piece, a careful repair, or expert cleaning, our team is here to help. Reach out through the contact section below to learn more or visit us in person.
          </p>
        </div>
      </section>

      <section id="contact" className="py-20 px-6 bg-brand-ink">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-eyebrow mb-3">Get In Touch</p>
            <h2 className="font-serif text-3xl lg:text-4xl text-brand-cream font-semibold">
              Contact <span className="text-gold-gradient">Us</span>
            </h2>
            <div className="mt-4 mx-auto w-16 h-px bg-brand-gold/40" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { label: 'Address', value: '[Street Address]\n[City, Province]' },
              { label: 'Phone', value: '[Your Phone Number]' },
              { label: 'Email', value: '[your@email.com]' },
              { label: 'Hours', value: 'Mon–Sat: [Hours]\nSun: [Hours]' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center sm:text-left">
                <h3 className="section-eyebrow mb-3">{label}</h3>
                <p className="text-brand-cream/75 text-sm leading-relaxed whitespace-pre-line">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
