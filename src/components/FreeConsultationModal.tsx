import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  MessageCircle, 
  Phone, 
  User, 
  MapPin, 
  Layers, 
  Send 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FreeConsultationModal: React.FC = () => {
  const { 
    isFreeConsultationOpen, 
    closeFreeConsultationModal, 
    t, 
    language 
  } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    requirement: '',
    contactMethod: 'WhatsApp',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  // Lock body scroll while modal is open & listen to Escape key
  useEffect(() => {
    if (isFreeConsultationOpen) {
      document.body.style.overflow = 'hidden';
      setSubmitted(false);
      setErrors({});
      setApiError('');
      setFormData({
        name: '',
        phone: '',
        location: '',
        requirement: '',
        contactMethod: 'WhatsApp',
        message: ''
      });
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFreeConsultationOpen) {
        closeFreeConsultationModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFreeConsultationOpen, closeFreeConsultationModal]);

  if (!isFreeConsultationOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim()) {
      errs.name = language === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your name.';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.phone = language === 'hi' ? 'कृपया मान्य 10-अंकीय मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.location) {
      errs.location = language === 'hi' ? 'कृपया एक स्थान चुनें।' : 'Please select a location.';
    }

    if (!formData.requirement.trim()) {
      errs.requirement = language === 'hi' ? 'कृपया अपनी प्रॉपर्टी आवश्यकता दर्ज करें।' : 'Please enter your property requirement.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const generateWhatsAppUrl = () => {
    const message = `Hello Satya Yadav, I would like to get free property consultancy from Smriti Vihar.\n\nName: ${formData.name.trim()}\nMobile: ${formData.phone.trim()}\nLocation: ${formData.location}\nRequirement: ${formData.requirement.trim()}\nPreferred Contact: ${formData.contactMethod}\nMessage: ${formData.message.trim() || 'N/A'}`;
    return `https://wa.me/919718526796?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');

    try {
      // 1. Post to backend
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          location: formData.location,
          requiredPlotSize: formData.requirement.trim(),
          message: `[Preferred Contact: ${formData.contactMethod}] ${formData.message.trim()}`,
          source: 'Free Property Consultancy'
        })
      });

      if (res.ok) {
        setSubmitted(true);
        try {
          confetti({
            particleCount: 65,
            spread: 55,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }

        // Also optionally open WhatsApp in a new tab if preferred method is WhatsApp
        if (formData.contactMethod === 'WhatsApp') {
          window.open(generateWhatsAppUrl(), '_blank');
        }
      } else {
        setApiError(t.generalErrorMessage);
      }
    } catch {
      setApiError(t.generalErrorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 flex items-center justify-center p-3 sm:p-4"
      id="free-consultancy-modal-overlay"
      onClick={closeFreeConsultationModal}
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
        id="free-consultancy-modal-content"
      >
        {/* Modal Header */}
        <div className="bg-stone-950 px-6 py-5 text-white relative border-b border-stone-800">
          <button 
            onClick={closeFreeConsultationModal}
            className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close consultation modal"
            id="close-free-consultancy-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.freeConsultancyTitle}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-brand text-amber-100 mb-1">
            {t.freeConsultancyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {t.freeConsultancySubtext}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            /* Success State */
            <div className="text-center py-6 space-y-5" id="consultancy-success-view">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  {t.consultationSuccessMsg}
                </h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  {t.consultationSuccessSub}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={generateWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="consultancy-success-whatsapp-btn"
                  className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>💬 {t.whatsAppNow}</span>
                </a>

                <a
                  href="tel:+919718526796"
                  id="consultancy-success-call-btn"
                  className="flex-1 py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <Phone className="w-4 h-4 fill-stone-950" />
                  <span>📞 {t.callNowBtn}</span>
                </a>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={closeFreeConsultationModal}
                  className="text-xs text-stone-500 hover:text-stone-800 font-semibold transition-colors"
                >
                  {t.close}
                </button>
              </div>
            </div>
          ) : (
            /* Consultation Form */
            <form onSubmit={handleSubmit} className="space-y-4" id="free-consultancy-form">
              {apiError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2" id="consultancy-error-banner">
                  <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.fullName} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.fullNamePlaceholder}
                    id="consultancy-name-input"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.name}</p>}
              </div>

              {/* 2. Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.mobileNumber} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder={t.mobilePlaceholder}
                    id="consultancy-phone-input"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.phone}</p>}
              </div>

              {/* 3. Interested Location */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.interestedLocation} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <select
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    id="consultancy-location-select"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800 ${
                      errors.location ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                    }`}
                  >
                    <option value="">{t.selectLocationPrompt}</option>
                    <option value="Darbhanga">{t.locDarbhanga}</option>
                    <option value="Madhubani">{t.locMadhubani}</option>
                    <option value="Pandaul">{t.locPandaul}</option>
                    <option value="Jhanjharpur">{t.locJhanjharpur}</option>
                    <option value="Other">{t.locOther}</option>
                  </select>
                </div>
                {errors.location && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.location}</p>}
              </div>

              {/* 4. Property / Plot Requirement */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.plotRequirementLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.requirement}
                    onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                    placeholder={t.plotRequirementPlaceholder}
                    id="consultancy-requirement-input"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.requirement ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                    }`}
                  />
                </div>
                {errors.requirement && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.requirement}</p>}
              </div>

              {/* 5. Preferred Contact Method */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.preferredContactMethod}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, contactMethod: 'WhatsApp' })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      formData.contactMethod === 'WhatsApp'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-400'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.contactMethodWhatsApp}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, contactMethod: 'Call' })}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      formData.contactMethod === 'Call'
                        ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-400'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t.contactMethodCall}</span>
                  </button>
                </div>
              </div>

              {/* 6. Message (Optional) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.messageLabel}
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t.messagePlaceholder}
                  id="consultancy-message-input"
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              {/* Action Buttons: Submit & Cancel */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={closeFreeConsultationModal}
                  id="cancel-free-consultancy-btn"
                  className="py-3 px-5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs sm:text-sm transition-colors"
                >
                  {t.cancel}
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  id="submit-free-consultancy-btn"
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? t.submitting : t.getFreeConsultancy}</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-500 text-center">
                🔒 Direct advisory by Satya Yadav. 100% free consultation with honest rates.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

