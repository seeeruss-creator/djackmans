import ServicePageLayout from '../../components/public/ServicePageLayout.jsx';
import dryImg from '../../assets/images/placeholder.svg';

export default function DryCleaning() {
  return (
    <ServicePageLayout
      banner={dryImg}
      eyebrow="Service"
      title="Dry Cleaning"
      subtitle="Gentle care for garments that deserve it."
    >
      <p className="text-brand-cream/70 text-lg leading-relaxed mb-10">
        Delicate fabrics — silk, lace, organza, barong piña — require professional dry cleaning
        to preserve their texture and structure. We clean gowns, suits, formal wear, and everyday
        garments with the care they need.
      </p>

      <h2 className="font-serif text-brand-cream text-2xl font-semibold mb-6">How It Works</h2>
      <div className="space-y-6 mb-10">
        {[
          ['Drop Off', 'Bring your garments to the shop and let us know about any specific stains or concerns.'],
          ['Inspection & Tagging', 'We tag and inspect each piece, noting fabric type and any delicate areas.'],
          ['Professional Cleaning', 'Garments are cleaned using appropriate dry cleaning solvents and pressed.'],
          ['Pickup', 'Collect your freshly cleaned and finished garments. We will notify you when they are ready.'],
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
        <h3 className="font-serif text-brand-cream font-semibold mb-3">We Clean</h3>
        <ul className="grid grid-cols-2 gap-2 text-brand-cream/60 text-sm">
          {['Gowns & formal wear', 'Barong Tagalog', 'Suits & blazers', 'Filipiniana', 'Wedding dresses', 'Everyday clothing', 'Delicate fabrics', 'Embroidered pieces'].map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
      </div>
    </ServicePageLayout>
  );
}
