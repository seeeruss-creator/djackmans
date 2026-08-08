import gownImg from '../../assets/images/placeholder.svg';
import blackTuxedoImg from '../../assets/images/placeholder.svg';
import barongImg from '../../assets/images/placeholder.svg';
import blackDressImg from '../../assets/images/placeholder.svg';
import beigeImg from '../../assets/images/placeholder.svg';
import filipinianaImg from '../../assets/images/placeholder.svg';
import graySuitImg from '../../assets/images/placeholder.svg';
import royalBlueImg from '../../assets/images/placeholder.svg';

const garments = [
  { img: gownImg, name: 'Gown' },
  { img: blackTuxedoImg, name: 'Black Tuxedo' },
  { img: barongImg, name: 'Barong Tagalog' },
  { img: blackDressImg, name: 'Black Dress' },
  { img: beigeImg, name: 'Beige Ensemble' },
  { img: filipinianaImg, name: 'Filipiniana' },
  { img: graySuitImg, name: 'Gray Suit' },
  { img: royalBlueImg, name: 'Royal Blue Suit' },
];

export default function GarmentGallery() {
  return (
    <section className="py-20 px-6 bg-brand-black">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-eyebrow mb-3">Featured Collection</p>
          <h2 className="font-serif text-3xl lg:text-4xl text-brand-cream font-semibold">
            Our <span className="text-gold-gradient">Finest Garments</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {garments.map(({ img, name }) => (
            <div key={name} className="group relative overflow-hidden aspect-[3/4]">
              <img
                src={img}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-serif text-brand-cream font-medium text-sm">{name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
