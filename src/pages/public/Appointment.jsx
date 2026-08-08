export default function Appointment() {
  return (
    <div className="bg-brand-black min-h-screen py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="section-eyebrow mb-4">Book a Visit</p>
        <h1 className="font-serif text-4xl lg:text-5xl text-brand-cream font-bold mb-6">
          Appointment
        </h1>
        <div className="h-px w-16 bg-brand-gold mb-10" />

        <p className="text-brand-cream/70 text-lg leading-relaxed mb-10">
          We welcome walk-ins and scheduled appointments. To ensure the tailor is available and fully prepared for
          your consultation, we recommend reaching out to us in advance via call, text, or Facebook Messenger.
        </p>

        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {[
            ['Call or Text', 'Phone / SMS', '+63 917 123 4567'],
            ['Facebook Messenger', 'Messenger', 'fb.com/djackman'],
            ['Walk In', 'Store Hours', 'Mon–Sat 8am–7pm\nSun 10am–5pm'],
          ].map(([title, type, detail]) => (
            <div key={title} className="border border-brand-gold/20 p-6">
              <p className="section-eyebrow mb-2">{type}</p>
              <h3 className="font-serif text-brand-cream font-semibold text-lg mb-2">{title}</h3>
              <p className="text-brand-cream/60 text-sm whitespace-pre-line">{detail}</p>
            </div>
          ))}
        </div>

        <div className="bg-brand-ink border border-brand-gold/10 p-8">
          <h2 className="font-serif text-brand-cream text-2xl font-semibold mb-6">What to Expect</h2>
          {[
            ['1', 'Reach Out', 'Contact us via phone, text, or Messenger to tell us what service you need.'],
            ['2', 'Schedule Your Visit', 'We will confirm an available time for your consultation with the tailor.'],
            ['3', 'Come In', 'Bring any reference photos, existing garments, or event details to your appointment.'],
            ['4', 'Consultation', 'The tailor will take measurements, discuss your requirements, and walk you through the process.'],
          ].map(([num, title, desc]) => (
            <div key={num} className="flex gap-5 mb-6 last:mb-0">
              <div className="mt-1 w-8 h-8 rounded-full border border-brand-gold/40 flex items-center justify-center shrink-0">
                <span className="text-brand-gold font-serif font-bold text-sm">{num}</span>
              </div>
              <div>
                <h4 className="text-brand-cream font-serif font-semibold mb-1">{title}</h4>
                <p className="text-brand-cream/60 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
