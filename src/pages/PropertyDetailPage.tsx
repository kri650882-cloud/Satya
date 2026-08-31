import React, { useState } from 'react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { SafeImage } from '../components/SafeImage';
import { 
  MapPin, 
  Compass, 
  Layers, 
  Heart, 
  MessageCircle, 
  Phone, 
  CalendarCheck, 
  Navigation, 
  Sparkles, 
  Info, 
  FileCheck2, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2, 
  ExternalLink,
  ShieldAlert,
  Send,
  Building2,
  CheckCircle2
} from 'lucide-react';

interface PropertyDetailPageProps {
  property: Property;
  navigate: (path: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ property, navigate }) => {
  const { 
    t, 
    language, 
    settings, 
    isFavorite, 
    toggleFavorite, 
    isCompared, 
    toggleCompare, 
    openEnquiryModal,
    openSiteVisitModal, 
    getWhatsAppLink, 
    getCallLink, 
    getDirectionsLink,
    openChatbot
  } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const favorite = isFavorite(property.id);
  const compared = isCompared(property.id);
  const isSold = property.availability === 'Sold';
  const isOnHold = property.availability === 'On Hold';

  const galleryImages = property.images && property.images.length > 0 
    ? property.images 
    : [property.coverImage];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-28 lg:pb-16 pt-6">
      
      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-3 rounded-full bg-stone-800 text-white hover:bg-stone-700 transition-colors z-10"
            title={t.close}
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 p-3 rounded-full bg-stone-800/80 text-white hover:bg-stone-700 transition-colors z-10"
            title="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 p-3 rounded-full bg-stone-800/80 text-white hover:bg-stone-700 transition-colors z-10"
            title="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-5xl max-h-[85vh] relative">
            <img
              src={galleryImages[activeImageIndex]}
              alt={`${property.title} large`}
              className="max-h-[85vh] max-w-full object-contain mx-auto rounded-xl"
            />
            <div className="text-center mt-3 text-xs text-stone-300">
              Image {activeImageIndex + 1} of {galleryImages.length} • {t.aiRepresentativeBadge}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Bar */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6 flex-wrap">
          <button onClick={() => navigate('/')} className="hover:text-amber-700 font-medium">
            {t.navHome}
          </button>
          <span>/</span>
          <button onClick={() => navigate('/properties')} className="hover:text-amber-700 font-medium">
            {t.navProperties}
          </button>
          <span>/</span>
          <span className="text-stone-900 font-bold truncate max-w-xs">{property.title}</span>
        </div>

        {/* Top Header Information & Actions */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {/* Status */}
                {isSold ? (
                  <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider">
                    🔴 {t.sold}
                  </span>
                ) : isOnHold ? (
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider">
                    🟡 {t.onHold}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider">
                    🟢 {t.available}
                  </span>
                )}

                {property.isDemoFields && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                    {t.demoEditableBadge}
                  </span>
                )}

                <span className="text-xs text-stone-500 font-medium">
                  {property.propertyType}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-sm text-stone-600">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{property.location}</span>
                <span className="text-stone-300">•</span>
                <span className="text-stone-500">{property.locationHighlight}</span>
              </div>
            </div>

            {/* Price & Primary Action Tools */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4">
              <div className="bg-stone-950 text-white px-5 py-3 rounded-2xl border border-stone-800 shadow-md text-left lg:text-right">
                <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  {t.pricePerSqft}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  ₹{property.pricePerSqft.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-stone-300"> / sq.ft.</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleCompare(property.id)}
                  id="detail-compare-btn"
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    compared 
                      ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm' 
                      : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-300'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{compared ? t.compared : t.compare}</span>
                </button>

                <button
                  onClick={() => toggleFavorite(property.id)}
                  id="detail-favorite-btn"
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    favorite 
                      ? 'bg-rose-500 text-white border-rose-400 shadow-sm' 
                      : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-300'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-white' : ''}`} />
                  <span>{favorite ? t.favorited : t.favorite}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Main Grid: Visual Gallery (Left 7 cols) & Purchase Inquiry Panel (Right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Gallery & Specifications */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Gallery Main Container */}
            <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-sm overflow-hidden space-y-3">
              <div 
                className="relative aspect-16/10 rounded-2xl overflow-hidden bg-stone-900 cursor-pointer group"
                onClick={() => setLightboxOpen(true)}
              >
                <SafeImage
                  src={galleryImages[activeImageIndex]}
                  alt={`${property.title} - View ${activeImageIndex + 1}`}
                  aspectRatio="aspect-16/10"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  showAiBadge={true}
                />

                <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setLightboxOpen(true); }}
                    className="p-2 rounded-xl bg-stone-950/80 text-white hover:bg-stone-900 transition-colors shadow-md backdrop-blur-xs"
                    title="Fullscreen View"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              {galleryImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 sm:w-24 aspect-16/10 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx 
                          ? 'border-amber-500 ring-2 ring-amber-300' 
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Core Specifications Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
              <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-amber-600" />
                <span>{language === 'hi' ? 'प्लॉट विवरण एवं चौहद्दी' : 'Plot Specifications & Dimensions'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-xs uppercase font-bold text-stone-500 block mb-1">
                    {t.plotNumber}
                  </span>
                  <span className="text-base font-extrabold text-stone-900">
                    {property.plotNumber}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-xs uppercase font-bold text-stone-500 block mb-1">
                    {t.plotSize}
                  </span>
                  <span className="text-base font-extrabold text-stone-900">
                    {property.plotSize}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-xs uppercase font-bold text-stone-500 block mb-1">
                    {t.roadWidth}
                  </span>
                  <span className="text-base font-extrabold text-stone-900">
                    {property.roadWidth}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-xs uppercase font-bold text-stone-500 block mb-1">
                    {t.facing}
                  </span>
                  <span className="text-base font-extrabold text-stone-900 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-600" />
                    <span>{property.facing}</span>
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-xs uppercase font-bold text-stone-500 block mb-1">
                    {t.registryAvailable}
                  </span>
                  <span className="text-base font-extrabold text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>{property.registryStatus || 'Verified & Ready'}</span>
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                  <span className="text-xs uppercase font-bold text-stone-500 block mb-1">
                    {t.propertyType}
                  </span>
                  <span className="text-base font-extrabold text-stone-900">
                    {property.propertyType}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 pt-6 border-t border-stone-100">
                <h3 className="text-sm font-bold text-stone-900 mb-2">{t.description}</h3>
                <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Nearby & Connectivity */}
            {property.nearbyPlaces && property.nearbyPlaces.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
                <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <span>{t.nearbyConnectivity}</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.nearbyPlaces.map((place, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-bold text-stone-900 text-xs sm:text-sm block">{place.name}</span>
                        {place.distance && (
                          <span className="text-xs text-stone-500">{place.distance}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Google Maps Directions Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-amber-600" />
                    <span>{property.mapType || t.approximateLocation}</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Navigate directly to the plot area using Google Maps navigation.
                  </p>
                </div>

                <a
                  href={getDirectionsLink(property)}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="google-maps-directions-btn"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-colors shrink-0"
                >
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span>{t.getDirections}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              </div>

              {/* Map embed iframe fallback box */}
              <div className="rounded-2xl overflow-hidden border border-stone-200 aspect-16/9 bg-stone-100 relative">
                <iframe
                  title="Plot Location Map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(property.mapDestination || `${property.location}, Bihar`)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                ></iframe>
              </div>
            </div>

          </div>

          {/* Right Column: Direct Contact & Inquire Now Action Box (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            
            {/* Primary Action Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">
                  {settings.brandName} Direct Advisory
                </span>
                <h3 className="text-2xl font-extrabold text-stone-900">
                  {language === 'hi' ? 'प्लॉट के लिए पूछताछ या साइट विजिट' : 'Inquire or Schedule Site Visit'}
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Connect with Satya Yadav for mutation records, road frontage checks, and instant WhatsApp brochures.
                </p>
              </div>

              <div className="space-y-3">
                {/* Secondary CTA: Inquire Now */}
                <button
                  onClick={() => openEnquiryModal(property)}
                  id="detail-inquire-now-btn"
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-stone-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Send className="w-4 h-4 text-stone-950" />
                  <span>{t.inquireNow}</span>
                </button>

                {/* Book Site Visit CTA */}
                <button
                  onClick={() => openSiteVisitModal(property.id, property.location)}
                  id="detail-book-visit-btn"
                  className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <CalendarCheck className="w-4 h-4 text-amber-400" />
                  <span>{t.bookSiteVisit}</span>
                </button>

                {/* WhatsApp CTA */}
                <a
                  href={getWhatsAppLink(property)}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="detail-whatsapp-btn"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-950/20"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{t.whatsAppUs}</span>
                </a>

                {/* Call Owner */}
                <a
                  href={getCallLink()}
                  id="detail-call-btn"
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 active:scale-[0.99] text-stone-800 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-stone-300"
                >
                  <Phone className="w-3.5 h-3.5 text-stone-700" />
                  <span>{t.talkToOwner} (+91 9718526796)</span>
                </a>
              </div>

              {/* AI Advisor Assistant Trigger */}
              <div className="pt-4 border-t border-stone-100">
                <button
                  onClick={() => openChatbot(`Tell me about the residential plot in ${property.location.split(',')[0]} (Plot No. ${property.plotNumber}) with price ₹${property.pricePerSqft}/sq.ft.`)}
                  id="detail-ask-ai-btn"
                  className="w-full p-3 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-left transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 group-hover:rotate-12 transition-transform" />
                    <div>
                      <span className="text-xs font-bold text-amber-900 block">
                        {t.askAiAdvisor}
                      </span>
                      <span className="text-[10px] text-amber-700">
                        Ask about road connectivity, nearby railway/airport, and suitability
                      </span>
                    </div>
                  </div>
                </button>
              </div>

              {/* Trust disclaimer */}
              <div className="text-[11px] text-stone-500 space-y-1">
                <p>✓ Direct owner assistance with transparent pricing</p>
                <p>✓ Physical verification of boundary pillars</p>
                <p>✓ Complete registry assistance</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
