import ServicePageLayout from '../../components/public/ServicePageLayout.jsx';
import repairImg from '../../assets/images/placeholder.svg';

export default function Repair() {
  return (
    <ServicePageLayout
      banner={repairImg}
      eyebrow="Service"
      title="Garment Repair"
      subtitle="Restore what matters. Revive what you love."
    >
      <p className="text-brand-cream/70 text-lg leading-relaxed mb-10">
        Worn seams, torn linings, broken zippers, altered fits — our tailors handle all manner of garment
        repairs with the same precision they bring to new work. Bring us your garment in any condition
        and we'll assess what can be done.
      </p>

      <h2 className="font-serif text-brand-cream text-2xl font-semibold mb-6">How It Works</h2>
      <div className="space-y-6 mb-10">
        {[
          ['Bring Your Garment', 'Drop off the piece that needs work. No appointment required for drop-offs.'],
          ['Damage Assessment', 'The tailor inspects the garment and explains what repairs are possible and advisable.'],
          ['Repair Work', 'We carry out the repair with care and the correct materials to match the original.'],
          ['Pickup', 'Collect your restored garment. We will call or message you when it is ready.'],
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
        <h3 className="font-serif text-brand-cream font-semibold mb-3">Common Repairs</h3>
        <ul className="grid grid-cols-2 gap-2 text-brand-cream/60 text-sm">
          {['Seam repairs', 'Zipper replacement', 'Lining repairs', 'Hemming', 'Button replacement', 'Re-stitching', 'Resizing & alterations', 'Patch work'].map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
      </div>
    </ServicePageLayout>
  );
}
