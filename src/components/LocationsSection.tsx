import React from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Property } from '../types';
import { SafeImage } from './SafeImage';
import { getCleanPropertyImages } from '../data/propertyImages';

interface LocationsSectionProps {
  onSelectProperty: (property: Property) => void;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({ onSelectProperty }) => {
  const { t, language, properties } = useApp();

  const darbhangaProp = properties.find(p => p.slug === 'darbhanga' || p.location.toLowerCase().includes('darbhanga'));
  const madhubaniProp = properties.find(p => p.slug === 'madhubani' || p.location.toLowerCase().includes('madhubani'));
  const pandaulProp = properties.find(p => p.slug === 'pandaul' || p.location.toLowerCase().includes('pandaul'));
  const jhanjharpurProp = properties.find(p => p.slug === 'jhanjharpur' || p.location.toLowerCase().includes('jhanjharpur'));

  const darbhangaImg = darbhangaProp ? getCleanPropertyImages(darbhangaProp) : { coverImage: '/images/placeholder_darbhanga.svg', isOriginal: false };
  const madhubaniImg = madhubaniProp ? getCleanPropertyImages(madhubaniProp) : { coverImage: '/images/placeholder_madhubani.svg', isOriginal: false };
  const pandaulImg = pandaulProp ? getCleanPropertyImages(pandaulProp) : { coverImage: '/images/placeholder_pandaul.svg', isOriginal: false };
  const jhanjharpurImg = jhanjharpurProp ? getCleanPropertyImages(jhanjharpurProp) : { coverImage: '/images/placeholder_jhanjharpur.svg', isOriginal: false };

  const locationCards = [
    {
      name: "Darbhanga",
      hiName: "दरभंगा",
      state: "Bihar",
      hiState: "बिहार",
      prop: darbhangaProp,
      price: darbhangaProp ? `₹${darbhangaProp.pricePerSqft.toLocaleString('en-IN')}/sq.ft.` : "₹1,800/sq.ft.",
      highlight: darbhangaProp ? darbhangaProp.locationHighlight : "Near Darbhanga Airport — approx. 3 km",
      access: darbhangaProp ? darbhangaProp.accessibility : "Main Road Connected",
      image: darbhangaImg.coverImage,
      isOriginal: darbhangaImg.isOriginal,
      badge: language === 'hi' ? "एयरपोर्ट कॉरिडोर" : "Airport Corridor"
    },
    {
      name: "Madhubani",
      hiName: "मधुबनी",
      state: "Bihar",
      hiState: "बिहार",
      prop: madhubaniProp,
      price: madhubaniProp ? `₹${madhubaniProp.pricePerSqft.toLocaleString('en-IN')}/sq.ft.` : "₹900/sq.ft.",
      highlight: madhubaniProp ? madhubaniProp.locationHighlight : "Near Madhubani Railway Station — approx. 5 km",
      access: madhubaniProp ? madhubaniProp.accessibility : "Main Road Connected",
      image: madhubaniImg.coverImage,
      isOriginal: madhubaniImg.isOriginal,
      badge: language === 'hi' ? "जिला मुख्यालय" : "District HQ"
    },
    {
      name: "Pandaul",
      hiName: "सकरी / पंडौल",
      state: "Madhubani, Bihar",
      hiState: "मधुबनी, बिहार",
      prop: pandaulProp,
      price: pandaulProp ? `₹${pandaulProp.pricePerSqft.toLocaleString('en-IN')}/sq.ft.` : "₹1,000/sq.ft.",
      highlight: pandaulProp ? pandaulProp.locationHighlight : "Near Pandaul Market",
      access: pandaulProp ? pandaulProp.accessibility : "Market Road",
      image: pandaulImg.coverImage,
      isOriginal: pandaulImg.isOriginal,
      badge: language === 'hi' ? "मार्केट हब" : "Market Hub"
    },
    {
      name: "Jhanjharpur",
      hiName: "झंझारपुर",
      state: "Bihar",
      hiState: "बिहार",
      prop: jhanjharpurProp,
      price: jhanjharpurProp ? `₹${jhanjharpurProp.pricePerSqft.toLocaleString('en-IN')}/sq.ft.` : "₹1,300/sq.ft.",
      highlight: jhanjharpurProp ? jhanjharpurProp.locationHighlight : "Near Jhanjharpur Market",
      access: jhanjharpurProp ? jhanjharpurProp.accessibility : "Market Road",
      image: jhanjharpurImg.coverImage,
      isOriginal: jhanjharpurImg.isOriginal,
      badge: language === 'hi' ? "प्राइम एक्सेस" : "Prime Access"
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-stone-100/70 border-y border-stone-200" id="locations-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5 text-amber-700" />
            <span>Mithila Region Bihar</span>
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
            {t.exploreLocationsHeading}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-stone-600 mt-2">
            {t.exploreLocationsSub}
          </p>
        </div>

        {/* 4 Location Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {locationCards.map((loc) => (
            <div
              key={loc.name}
              className="group bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Visual Image with SafeImage */}
                <div 
                  className="relative aspect-4/3 overflow-hidden bg-stone-900 cursor-pointer"
                  onClick={() => loc.prop && onSelectProperty(loc.prop)}
                >
                  <SafeImage
                    src={loc.image}
                    alt={`${loc.name} residential plot`}
                    aspectRatio="aspect-4/3"
                    className="w-full h-full object-cover"
                    showAiBadge={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent pointer-events-none"></div>

                  <div className="absolute top-3 left-3 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-md bg-stone-950/90 text-[10px] font-bold text-amber-300 border border-stone-700">
                      {loc.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {language === 'hi' ? loc.hiName : loc.name}
                    </h3>
                    <p className="text-xs text-stone-300 font-medium">
                      {language === 'hi' ? loc.hiState : loc.state}
                    </p>
                  </div>
                </div>

                {/* Content specs */}
                <div className="p-4 space-y-2.5">
                  <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                    <span className="text-xs text-stone-500 font-semibold">{t.pricePerSqft}</span>
                    <span className="text-base font-extrabold text-stone-900">{loc.price}</span>
                  </div>

                  <div className="text-xs text-stone-700 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                    <span className="font-medium">{loc.access}</span>
                  </div>

                  <div className="text-xs text-stone-600 flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{loc.highlight}</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => loc.prop && onSelectProperty(loc.prop)}
                  id={`view-location-property-${loc.name.toLowerCase()}`}
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm group-hover:bg-amber-500 group-hover:text-stone-950"
                >
                  <span>{t.viewProperty}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
