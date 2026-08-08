import ServicePageLayout from '../../components/public/ServicePageLayout.jsx';
import rentImg from '../../assets/images/placeholder.svg';
import GarmentGallery from '../../components/public/GarmentGallery.jsx';

export default function Rental() {
  return (
    <>
      <ServicePageLayout
        banner={rentImg}
        eyebrow="Service"
        title="Garment Rental"
        subtitle="Dress for the occasion — without the permanent commitment."
      >
        <p className="text-brand-cream/70 text-lg leading-relaxed mb-10">
          Our rental collection covers everything from traditional barong tagalog and filipiniana to sharp suits,
          black tie tuxedos, ball gowns, and cocktail dresses — all meticulously maintained and ready for your event.
        </p>

        <h2 className="font-serif text-brand-cream text-2xl font-semibold mb-6">How It Works</h2>
        <div className="space-y-6 mb-10">
          {[
            ['Browse & Choose', 'Come in to try on pieces from our collection. Tell us your event date so we can check availability.'],
            ['Fitting & Adjustments', 'We take your measurements and make any necessary minor alterations for a perfect fit.'],
            ['Pickup & Wear', 'Collect your garment before your event. It will be cleaned, pressed, and ready.'],
            ['Return', 'Return the garment within the agreed rental period. Any soiling or damage may incur additional fees.'],
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
            <li>· Your event date and occasion details</li>
            <li>· Your body measurements if you have them (we will take them if not)</li>
            <li>· A reference photo of your preferred style</li>
          </ul>
        </div>
      </ServicePageLayout>
      <GarmentGallery />
    </>
  );
}
