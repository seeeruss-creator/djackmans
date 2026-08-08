import ServicePageLayout from '../../components/public/ServicePageLayout.jsx';
import customImg from '../../assets/images/placeholder.svg';

export default function Customize() {
  return (
    <ServicePageLayout
      banner={customImg}
      eyebrow="Service"
      title="Customization"
      subtitle="Your vision, cut and sewn to perfection."
    >
      <p className="text-brand-cream/70 text-lg leading-relaxed mb-10">
        Every bespoke piece we create begins with a conversation. Whether it's a barong for a wedding,
        a filipiniana for a formal event, or a tailored suit for everyday elegance — we work with you
        to bring your exact vision to life, fabric selection included.
      </p>

      <h2 className="font-serif text-brand-cream text-2xl font-semibold mb-6">The Process</h2>
      <div className="space-y-6 mb-10">
        {[
          ['Consultation', 'Discuss your garment type, style references, event, and budget with the tailor.'],
          ['Fabric Selection', 'Choose from our curated selection of fabrics, or bring your own material.'],
          ['Measurements & Pattern', 'We take your complete measurements and draft a custom pattern for your body.'],
          ['Fitting & Pickup', 'Try the garment for a fitting session, then collect your finished piece in-store.'],
        ].map(([title, desc], i) => (
          <div key={title} className="flex gap-5 border-l-2 border-brand-gold/30 pl-5">
            <div>
              <p className="section-eyebrow mb-1">Step {i + 1}</p>
              <h3 className="font-serif text-brand-cream font-semibold">{title}</h3>
              <p className="text-brand-cream/60 text-sm leading-relaxed mt-1">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-brand-ink border border-brand-gold/10 p-6">
        <h3 className="font-serif text-brand-cream font-semibold mb-3">What to Bring</h3>
        <ul className="space-y-2 text-brand-cream/60 text-sm">
          <li>· Style inspiration photos or sketches</li>
          <li>· Fabric (if you have your own) or be ready to choose from our selection</li>
          <li>· Your event date so we can plan the completion timeline</li>
        </ul>
      </div>
    </ServicePageLayout>
  );
}
