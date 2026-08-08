export default function ServiceCard({ image, title, description }) {
  return (
    <div className="group overflow-hidden border border-brand-gold/10 hover:border-brand-gold/40 transition-colors">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/20 to-transparent" />
      </div>
      <div className="bg-brand-ink p-6">
        <h3 className="font-serif font-semibold text-brand-cream text-lg mb-2 group-hover:text-brand-gold transition-colors">
          {title}
        </h3>
        <p className="text-brand-cream/60 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
