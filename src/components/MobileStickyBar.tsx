import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, MessageCircle, Sparkles } from 'lucide-react';

interface MobileStickyBarProps {
  currentPropertyId?: string;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ currentPropertyId }) => {
  const { t, getCallLink, getWhatsAppLink, openFreeConsultationModal, properties } = useApp();

  const property = currentPropertyId 
    ? properties.find(p => p.id === currentPropertyId || p.slug === currentPropertyId) 
    : null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 p-2.5 shadow-2xl safe-area-pb">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
        {/* Call Button */}
        <a
          href={getCallLink()}
          id="mobile-sticky-call"
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-95 text-stone-100 font-bold text-xs transition-transform border border-stone-800"
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
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs transition-transform shadow-sm"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span className="truncate">WhatsApp</span>
        </a>

        {/* Free Consultancy Button */}
        <button
          onClick={() => openFreeConsultationModal()}
          id="mobile-sticky-consultancy"
          className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-extrabold text-xs transition-transform shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-stone-950" />
          <span className="truncate">{t.freeConsultation}</span>
        </button>
      </div>
    </div>
  );
};
