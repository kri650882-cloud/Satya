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
      access: language === 'hi' ? "मुख्य सड़क से जुड़ा (Main Road Connected)" : "Main Road Connected",
      highlight: language === 'hi' ? "दरभंगा एयरपोर्ट के पास — लगभग 3 किमी" : "Near Darbhanga Airport — approximately 3 km",
      webpImage: "/images/plot_darbhanga_600w.webp",
      image: darbhangaImg.coverImage || "/images/plot_darbhanga.jpg",
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
      access: language === 'hi' ? "मुख्य सड़क से सीधा संपर्क" : "Main Road Connected",
      highlight: language === 'hi' ? "मधुबनी रेलवे स्टेशन के पास — लगभग 5 किमी" : "Near Madhubani Railway Station — approximately 5 km",
      webpImage: "/images/plot_madhubani_600w.webp",
      image: madhubaniImg.coverImage || "/images/plot_madhubani.jpg",
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
      access: language === 'hi' ? "मार्केट रोड से जुड़ाव" : "Market Road Connected",
      highlight: language === 'hi' ? "पंडौल बाज़ार के पास — लगभग 1.5 किमी" : "Near Pandaul Market — approximately 1.5 km",
      webpImage: "/images/plot_pandaul_600w.webp",
      image: pandaulImg.coverImage || "/images/plot_pandaul.jpg",
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
      access: language === 'hi' ? "50 फीट चौड़ी पक्की सड़क" : "50 ft Wide Road Frontage",
      highlight: language === 'hi' ? "झंझारपुर अनुमंडल बाज़ार के पास" : "Near Jhanjharpur Sub-division Market",
      webpImage: "/images/plot_jhanjharpur_600w.webp",
      image: jhanjharpurImg.coverImage || "/images/plot_jhanjharpur.jpg",
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
              className="group bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Visual Image with SafeImage - NO solid black bar/strip behind location name */}
                <div 
                  className="relative aspect-[16/11] overflow-hidden bg-stone-100 cursor-pointer"
                  onClick={() => loc.prop && onSelectProperty(loc.prop)}
                >
                  <SafeImage
                    src={loc.webpImage || loc.image}
                    fallbackSrc={loc.image}
                    alt={`${loc.name} residential plot`}
                    aspectRatio="aspect-[16/11]"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    showAiBadge={false}
                  />

                  {/* Extremely subtle transparent gradient overlay only for text contrast - NO black rectangular block */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

                  {/* Top Location Feature Badge */}
                  <div className="absolute top-3 left-3 pointer-events-none z-10">
                    <span className="px-2.5 py-1 rounded-full bg-stone-950/70 backdrop-blur-xs text-[10px] font-bold text-amber-300 border border-amber-400/30 shadow-xs">
                      {loc.badge}
                    </span>
                  </div>

                  {/* Location Name & State directly on bottom of image area in crisp White Typography with subtle text-shadow */}
                  <div className="absolute bottom-3 left-4 right-4 pointer-events-none z-10">
                    <h3 
                      className="text-xl sm:text-2xl font-extrabold text-white leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]"
                      style={{ textShadow: '0 2px 5px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.9)' }}
                    >
                      {language === 'hi' ? loc.hiName : loc.name}
                    </h3>
                    <p 
                      className="text-xs font-semibold text-amber-200 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] mt-0.5"
                      style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                    >
                      {language === 'hi' ? loc.hiState : loc.state}
                    </p>
                  </div>
                </div>

                {/* Content specs below image */}
                <div className="p-5 space-y-3.5 bg-white">
                  {/* Price per sq.ft. */}
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
                      {t.pricePerSqft}
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-stone-900 font-sans">
                      {loc.price}
                    </span>
                  </div>

                  {/* Location/Connectivity details */}
                  <div className="space-y-2 text-xs text-stone-700">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-500 font-black text-sm leading-none mt-0.5">◉</span>
                      <span className="font-medium text-stone-800 leading-snug">{loc.access}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-amber-500 font-black text-sm leading-none mt-0.5">◉</span>
                      <span className="text-stone-600 leading-snug">{loc.highlight}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action - View Details button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => loc.prop && onSelectProperty(loc.prop)}
                  id={`view-location-property-${loc.name.toLowerCase()}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-amber-500 text-stone-100 hover:text-stone-950 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-sm group/btn cursor-pointer"
                >
                  <span>{t.viewProperty}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
