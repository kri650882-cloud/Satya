import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  CalendarCheck, 
  MessageCircle, 
  MapPin, 
  FileCheck2, 
  Car, 
  UserCheck,
  Sparkles 
} from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const { 
    t, 
    language, 
    settings, 
    getWhatsAppLink, 
    openSiteVisitModal, 
    openFreeConsultationModal 
  } = useApp();

  return (
    <section className="relative bg-stone-950 text-white overflow-hidden border-b border-stone-800">
      {/* Background Image with Deep Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_plots_bihar_1788146973356.jpg"
          alt="Premium Residential Plots in Bihar"
          className="w-full h-full object-cover object-center brightness-50"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/85 to-stone-950/50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-18 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
        <div className="max-w-3xl">
          
          {/* Top Pill Badge Row */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900 border border-amber-400/40 text-amber-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>{settings.brandName} • {settings.ownerName}</span>
            </div>

            <button
              onClick={() => openFreeConsultationModal()}
              id="hero-free-advice-pill-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300 text-xs font-bold transition-all shadow-sm group cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.freeConsultation}</span>
            </button>
          </div>

          {/* Main Headings */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-4">
            {language === 'hi' ? (
              <>
                <span className="block text-amber-400 font-brand">अपने सपनों का प्लॉट खोजें।</span>
                <span className="block text-stone-100">अपना आशियाना बनाएं।</span>
              </>
            ) : (
              <>
                <span className="block text-stone-100">Find Your Perfect Plot.</span>
                <span className="block text-amber-400 font-brand">Build Your Dream Home.</span>
              </>
            )}
          </h1>

          {/* Hindi / Bi-lingual Headline */}
          <p className="text-sm sm:text-base md:text-lg text-amber-100 font-medium mb-4 leading-relaxed bg-stone-900/90 p-4 rounded-2xl border border-amber-500/30">
            {settings.hindiHeadline}
          </p>

          {/* Supporting Description */}
          <p className="text-xs sm:text-sm md:text-base text-stone-300 mb-8 leading-relaxed max-w-2xl">
            {language === 'hi' ? t.heroDesc : settings.heroDescription}
          </p>

          {/* Primary Actions / CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10">
            {/* Explore Button */}
            <button
              onClick={onExploreClick}
              id="hero-explore-properties-button"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-stone-950 font-extrabold text-sm sm:text-base transition-all shadow-lg shadow-amber-950/40"
            >
              <span>{t.exploreProperties}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Free Consultation CTA */}
            <button
              onClick={() => openFreeConsultationModal()}
              id="hero-free-consultation-button"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-sm sm:text-base border border-amber-400/50 transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.freeConsultation}</span>
            </button>

            {/* Book Site Visit Button */}
            <button
              onClick={() => openSiteVisitModal()}
              id="hero-book-site-visit-button"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold text-sm sm:text-base border border-stone-700 transition-all"
            >
              <CalendarCheck className="w-4 h-4 text-amber-400" />
              <span>{t.bookSiteVisit}</span>
            </button>

            {/* WhatsApp CTA */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-whatsapp-button"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base transition-all shadow-md shadow-emerald-950/30"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{t.whatsAppUs}</span>
            </a>
          </div>

          {/* Four Key Factual Trust Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-stone-800/80">
            <div className="flex items-center gap-2.5 text-stone-300">
              <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-amber-400">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-stone-100">{language === 'hi' ? '4 प्रमुख स्थान' : '4 Prime Locations'}</div>
                <div className="text-stone-400">Darbhanga & Madhubani</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-stone-300">
              <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-amber-400">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-stone-100">{t.registryAvailable}</div>
                <div className="text-stone-400">{language === 'hi' ? 'दस्तावेज सत्यापित' : 'Clear documentation'}</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-stone-300">
              <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-amber-400">
                <Car className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-stone-100">{language === 'hi' ? 'चौड़ी सड़कें' : 'Wide Road Frontage'}</div>
                <div className="text-stone-400">40ft - 60ft Access</div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-stone-300">
              <div className="p-2 rounded-xl bg-stone-900 border border-stone-800 text-amber-400">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-stone-100">{settings.ownerName}</div>
                <div className="text-stone-400">{t.propertyConsultant}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
