import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, MessageCircle, CalendarCheck } from 'lucide-react';

interface MobileStickyBarProps {
  currentPropertyId?: string;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ currentPropertyId }) => {
  const { t, getCallLink, getWhatsAppLink, openSiteVisitModal, properties } = useApp();

  const property = currentPropertyId 
    ? properties.find(p => p.id === currentPropertyId || p.slug === currentPropertyId) 
    : null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-900 border-t border-stone-800 p-2.5 shadow-2xl safe-area-pb">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
        {/* Call Button */}
        <a
          href={getCallLink()}
          id="mobile-sticky-call"
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 px-2 rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-95 text-stone-100 font-semibold text-xs transition-transform border border-stone-700/70"
        >
          <Phone className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="truncate">{t.callNow}</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={getWhatsAppLink(property)}
          target="_blank"
          rel="noopener noreferrer"
          id="mobile-sticky-whatsapp"
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold text-xs transition-transform shadow-sm shadow-emerald-950/40"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span className="truncate">WhatsApp</span>
        </a>

        {/* Site Visit Button */}
        <button
          onClick={() => openSiteVisitModal(property?.id, property?.location)}
          id="mobile-sticky-site-visit"
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold text-xs transition-transform shadow-sm shadow-amber-950/40"
        >
          <CalendarCheck className="w-4 h-4 text-stone-950" />
          <span className="truncate">{t.bookSiteVisit}</span>
        </button>
      </div>
    </div>
  );
};
