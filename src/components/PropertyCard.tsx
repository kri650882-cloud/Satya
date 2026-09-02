import React from 'react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { SafeImage } from './SafeImage';
import { getCleanPropertyImages } from '../data/propertyImages';
import { 
  MapPin, 
  Compass, 
  Layers, 
  Heart, 
  MessageCircle, 
  CalendarCheck, 
  Navigation, 
  Sparkles, 
  CheckCircle,
  FileCheck2,
  Send,
  Eye
} from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onViewDetails }) => {
  const { 
    t, 
    isFavorite, 
    toggleFavorite, 
    isCompared, 
    toggleCompare, 
    getWhatsAppLink, 
    openEnquiryModal,
    openSiteVisitModal,
    getDirectionsLink
  } = useApp();

  const favorite = isFavorite(property.id);
  const compared = isCompared(property.id);
  const isSold = property.availability === 'Sold';
  const isOnHold = property.availability === 'On Hold';
  const imgData = getCleanPropertyImages(property);

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(property);
    }
  };

  return (
    <div 
      className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full relative"
      id={`property-card-${property.slug || property.id}`}
    >
      {/* Top Image Section */}
      <div className="relative overflow-hidden cursor-pointer" onClick={handleCardClick}>
        <SafeImage
          src={imgData.coverImage}
          alt={property.title}
          aspectRatio="aspect-[16/10]"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          showAiBadge={!imgData.isOriginal}
          isOriginal={imgData.isOriginal}
          fallbackSrc={`/images/placeholder_${(property.slug || property.id).toLowerCase()}.svg`}
        />

        {/* Top Right Floating Action: Favorite & Compare */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => toggleCompare(property.id)}
            className={`p-2 rounded-xl transition-all shadow-md ${
              compared 
                ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300' 
                : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-950'
            }`}
            title={compared ? t.compared : t.compare}
            id={`compare-btn-${property.id}`}
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={() => toggleFavorite(property.id)}
            className={`p-2 rounded-xl transition-all shadow-md ${
              favorite 
                ? 'bg-rose-500 text-white ring-2 ring-rose-300' 
                : 'bg-stone-900 text-stone-300 hover:text-white hover:bg-stone-950'
            }`}
            title={favorite ? t.favorited : t.favorite}
            id={`favorite-btn-${property.id}`}
          >
            <Heart className={`w-4 h-4 ${favorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Banner inside Image: Status & Price */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-20 pointer-events-none">
          {/* Availability Status */}
          <div>
            {isSold ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span>{t.sold}</span>
              </span>
            ) : isOnHold ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500 text-stone-950 text-xs font-extrabold uppercase tracking-wider shadow-lg">
                <span>{t.onHold}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span>{t.available}</span>
              </span>
            )}
          </div>

          {/* Price Tag */}
          <div className="bg-stone-950 border border-amber-500/40 rounded-xl px-3 py-1.5 text-right shadow-lg">
            <span className="text-[10px] uppercase tracking-wider text-stone-300 block font-semibold">
              {t.pricePerSqft}
            </span>
            <span className="text-base font-extrabold text-amber-400">
              ₹{property.pricePerSqft.toLocaleString('en-IN')}
              <span className="text-xs font-normal text-stone-300"> / sq.ft.</span>
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Location & Title */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-600" />
              <span>{property.location}</span>
            </div>
            {property.isDemoFields && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
                {t.demoEditableBadge}
              </span>
            )}
          </div>

          <h3 
            onClick={handleCardClick}
            className="text-lg sm:text-xl font-bold text-stone-900 group-hover:text-amber-700 transition-colors cursor-pointer line-clamp-1 mb-2"
          >
            {property.title}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {property.description}
          </p>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-stone-50 border border-stone-100 text-xs mb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                {t.plotNumber}
              </span>
              <span className="font-bold text-stone-800">
                {property.plotNumber}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                {t.roadWidth}
              </span>
              <span className="font-bold text-stone-800">
                {property.roadWidth}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                {t.facing}
              </span>
              <span className="font-bold text-stone-800 flex items-center gap-1">
                <Compass className="w-3 h-3 text-stone-500" />
                <span>{property.facing}</span>
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 block">
                {t.plotSize}
              </span>
              <span className="font-bold text-stone-800">
                {property.plotSize}
              </span>
            </div>
          </div>

          {/* Registry & Connectivity Highlights */}
          <div className="flex items-center justify-between text-[11px] text-stone-600 mb-5 px-1">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{property.registryStatus || t.registryAvailable}</span>
            </div>
            <a
              href={getDirectionsLink(property)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-500 hover:text-amber-700 flex items-center gap-1 transition-colors"
              title="Google Maps Direction"
              onClick={(e) => e.stopPropagation()}
            >
              <Navigation className="w-3 h-3 text-amber-600" />
              <span>{t.approximateLocation}</span>
            </a>
          </div>
        </div>

        {/* Card Action Buttons: View Details (Primary), Inquire Now (Secondary), WhatsApp (Direct) */}
        {/* Call button intentionally removed from property card per requirements */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <div className="grid grid-cols-2 gap-2">
            {/* Primary: View Details */}
            <button
              onClick={handleCardClick}
              id={`view-details-btn-${property.slug || property.id}`}
              className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm group/btn"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.viewProperty}</span>
            </button>

            {/* Secondary: Inquire Now */}
            <button
              onClick={() => openEnquiryModal(property)}
              id={`inquire-now-btn-${property.slug || property.id}`}
              className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-stone-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5 text-stone-950" />
              <span>{t.inquireNow}</span>
            </button>
          </div>

          {/* WhatsApp Direct Query */}
          <a
            href={getWhatsAppLink(property)}
            target="_blank"
            rel="noopener noreferrer"
            id={`whatsapp-btn-${property.slug || property.id}`}
            className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>{t.whatsAppUs}</span>
          </a>
        </div>

      </div>
    </div>
  );
};
