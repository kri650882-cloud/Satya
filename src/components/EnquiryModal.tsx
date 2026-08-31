import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  MapPin, 
  MessageCircle, 
  Sparkles,
  Phone,
  User,
  IndianRupee,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const EnquiryModal: React.FC = () => {
  const { 
    isEnquiryOpen, 
    closeEnquiryModal, 
    enquiryProperty, 
    t, 
    language,
    getWhatsAppLink 
  } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    budget: '',
    requiredPlotSize: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (isEnquiryOpen) {
      setSubmitted(false);
      setErrors({});
      setApiError('');
      setFormData({
        name: '',
        phone: '',
        budget: '',
        requiredPlotSize: '',
        message: ''
      });
    }
  }, [isEnquiryOpen, enquiryProperty]);

  if (!isEnquiryOpen) return null;

  const propLocation = enquiryProperty?.location ? enquiryProperty.location.split(',')[0].trim() : 'Bihar';
  const propTitle = enquiryProperty?.title || `Residential Plot in ${propLocation}`;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = t.nameRequiredError || 'Please enter your full name.';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.phone = t.invalidPhoneError || 'Please enter a valid 10-digit Indian mobile number.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          location: enquiryProperty?.location || propLocation,
          budget: formData.budget || undefined,
          requiredPlotSize: formData.requiredPlotSize || undefined,
          message: formData.message || undefined,
          propertyId: enquiryProperty?.id || enquiryProperty?.slug || 'general',
          source: `Property Card: ${propLocation}`
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSubmitted(true);
          try {
            confetti({
              particleCount: 70,
              spread: 60,
              origin: { y: 0.6 }
            });
          } catch {
            // ignore
          }
        } else {
          setApiError(t.enquiryErrorGeneral || 'Something went wrong. Please try again or contact us on WhatsApp.');
        }
      } else {
        setApiError(t.enquiryErrorGeneral || 'Something went wrong. Please try again or contact us on WhatsApp.');
      }
    } catch {
      setApiError(t.enquiryErrorGeneral || 'Something went wrong. Please try again or contact us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      id="enquiry-modal-overlay"
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6"
        id="enquiry-modal-content"
      >
        {/* Modal Header */}
        <div className="bg-stone-900 text-white px-6 py-5 flex items-center justify-between border-b border-stone-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Smriti Vihar Property Consultation</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              {t.inquireAboutTitle} {propLocation} {language === 'hi' ? 'प्रॉपर्टी' : 'Property'}
            </h2>
          </div>

          <button
            onClick={closeEnquiryModal}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            id="close-enquiry-modal-btn"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-5" id="enquiry-success-view">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-stone-900 mb-2">
                  {t.enquirySuccessTitle}
                </h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  {t.enquirySuccessSub}
                </p>
              </div>

              {/* Property summary pill */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-700 text-left flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-stone-900 block">{propTitle}</span>
                  <span className="text-stone-500">
                    Plot No: {enquiryProperty?.plotNumber || 'Verified'} • {enquiryProperty?.pricePerSqft ? `₹${enquiryProperty.pricePerSqft}/sq.ft.` : 'Direct Owner Rate'}
                  </span>
                </div>
              </div>

              {/* Action Buttons on Success */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={getWhatsAppLink(
                    enquiryProperty, 
                    `Hello Satya Yadav, I just submitted an inquiry for the ${propLocation} plot on your website. My name is ${formData.name}. Please share the complete brochure and mutation/registry details.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="enquiry-success-whatsapp-btn"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{t.sendWhatsAppNow || 'Open in WhatsApp'}</span>
                </a>

                <button
                  onClick={closeEnquiryModal}
                  id="enquiry-success-close-btn"
                  className="py-3 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold text-sm transition-colors"
                >
                  {t.close}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" id="enquiry-form">
              {/* Selected Property Brief Box */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 text-xs text-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                  <div>
                    <span className="font-bold text-stone-900 block">{propLocation} Plot</span>
                    <span className="text-stone-600 text-[11px]">
                      {enquiryProperty?.plotNumber ? `Plot No. ${enquiryProperty.plotNumber} • ` : ''}
                      {enquiryProperty?.pricePerSqft ? `₹${enquiryProperty.pricePerSqft.toLocaleString('en-IN')}/sq.ft.` : ''}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-amber-500 text-stone-950 font-bold text-[10px] uppercase">
                  {t.available}
                </span>
              </div>

              {/* API General Error Notice */}
              {apiError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2" id="enquiry-error-banner">
                  <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              {/* Full Name */}
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
                    id="enquiry-name-input"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.name}</p>}
              </div>

              {/* Mobile Number */}
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
                    id="enquiry-phone-input"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                      errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-stone-200'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.phone}</p>}
              </div>

              {/* 2-Column row: Budget & Required Plot Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Budget Range */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t.budgetLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      id="enquiry-budget-select"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800"
                    >
                      <option value="">{t.budgetSelectPlaceholder}</option>
                      <option value="Under ₹10 Lakhs">{t.budgetUnder10L}</option>
                      <option value="₹10 - ₹25 Lakhs">{t.budget10to25L}</option>
                      <option value="₹25 - ₹50 Lakhs">{t.budget25to50L}</option>
                      <option value="Above ₹50 Lakhs">{t.budgetAbove50L}</option>
                    </select>
                  </div>
                </div>

                {/* Required Plot Size */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    {t.requiredPlotSize}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Layers className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.requiredPlotSize}
                      onChange={(e) => setFormData({ ...formData, requiredPlotSize: e.target.value })}
                      placeholder={t.plotSizePlaceholder}
                      id="enquiry-plotsize-input"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Message (Optional) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.messageLabel}
                </label>
                <textarea
                  rows={2}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t.messagePlaceholder}
                  id="enquiry-message-input"
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  id="submit-enquiry-btn"
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-stone-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? t.submitting : t.submitEnquiry}</span>
                </button>
              </div>

              <p className="text-[11px] text-stone-500 text-center">
                🔒 Direct advisory by Satya Yadav. Your contact number is kept secure and confidential.
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
