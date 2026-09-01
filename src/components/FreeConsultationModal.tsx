import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, Phone, X, Sparkles, Check, Copy, UserCheck, ShieldCheck } from 'lucide-react';

export const FreeConsultationModal: React.FC = () => {
  const { 
    isFreeConsultationOpen, 
    closeFreeConsultationModal, 
    t, 
    settings,
    language 
  } = useApp();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFreeConsultationOpen) {
        closeFreeConsultationModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFreeConsultationOpen, closeFreeConsultationModal]);

  if (!isFreeConsultationOpen) return null;

  const encodedMsg = encodeURIComponent(
    "Hello Satya Yadav, I would like a free property consultation from Smriti Vihar. Please guide me regarding available residential plots."
  );
  const whatsappUrl = `https://wa.me/919718526796?text=${encodedMsg}`;
  const phoneCallUrl = "tel:+919718526796";

  const handleCopyPhone = () => {
    navigator.clipboard.writeText("+919718526796");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 flex items-center justify-center p-3 sm:p-4"
      id="free-consultation-modal-overlay"
      onClick={closeFreeConsultationModal}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
        id="free-consultation-modal-content"
      >
        {/* Top Header with Warm Brand Theme */}
        <div className="bg-stone-950 px-6 py-6 text-white relative">
          <button 
            onClick={closeFreeConsultationModal}
            className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close consultation modal"
            id="close-consultation-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.freeConsultation} • {language === 'hi' ? 'निःशुल्क मार्गदर्शन' : '100% Free Advice'}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-brand text-amber-100 mb-1.5">
            {language === 'hi' ? 'सत्य यादव से सीधा परामर्श' : 'Direct Advisory with Satya Yadav'}
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            {t.freeConsultationSub}
          </p>
        </div>

        {/* Action Options Area */}
        <div className="p-6 space-y-4 bg-stone-50/50">
          
          {/* OPTION 1: WhatsApp Consultation */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeFreeConsultationModal}
            id="modal-whatsapp-consultation-btn"
            className="group block p-4 rounded-2xl bg-white border-2 border-emerald-500/40 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-base group-hover:text-emerald-700 transition-colors">
                      {t.chatOnWhatsApp}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                      {language === 'hi' ? 'तुरंत' : 'Fast'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'hi' ? 'WhatsApp पर मैसेज भेजें एवं तुरंत प्लॉट विवरण पाएं' : 'Instant plot details & photos on WhatsApp'}
                  </p>
                </div>
              </div>
            </div>
          </a>

          {/* OPTION 2: Call Consultation */}
          <a
            href={phoneCallUrl}
            onClick={closeFreeConsultationModal}
            id="modal-call-consultation-btn"
            className="group block p-4 rounded-2xl bg-white border-2 border-amber-500/40 hover:border-amber-500 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-md shadow-amber-950/20 group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6 fill-stone-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-base group-hover:text-amber-700 transition-colors">
                      {t.callForConsultation}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-stone-900 uppercase tracking-wider">
                      {language === 'hi' ? 'डायरेक्ट' : 'Direct'}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    +91 9718526796 • {language === 'hi' ? 'सीधे सत्य यादव से बात करें' : 'Talk directly with Satya Yadav'}
                  </p>
                </div>
              </div>
            </div>
          </a>

          {/* Direct Phone Copy Pill for Desktop Users */}
          <div className="pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-100 border border-stone-200 text-xs">
              <div className="flex items-center gap-2 text-stone-700 font-semibold">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span>{settings.ownerName}: <span className="font-mono text-stone-900 font-bold">+91 9718526796</span></span>
              </div>
              <button
                type="button"
                onClick={handleCopyPhone}
                className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                title="Copy phone number"
                id="copy-phone-consultation-btn"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">{language === 'hi' ? 'कॉपी हुआ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>{language === 'hi' ? 'कॉपी करें' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Trust points */}
          <div className="pt-2 border-t border-stone-200/80 flex items-center justify-center gap-4 text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'hi' ? '100% पारदर्शी' : '100% Transparent'}</span>
            </span>
            <span>•</span>
            <span>{language === 'hi' ? 'कोई ब्रोकरेज/कमीशन नहीं' : 'No Misleading Intermediaries'}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
