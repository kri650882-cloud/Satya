import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, MapPin, Phone, User, MessageSquare, CheckCircle, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const SiteVisitModal: React.FC = () => {
  const { 
    isSiteVisitOpen, 
    closeSiteVisitModal, 
    siteVisitInitialData, 
    properties, 
    settings, 
    t, 
    language 
  } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    date: '',
    preferredTime: 'Morning (10:00 AM - 1:00 PM)',
    plotRequirement: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState('');

  // Set initial location from property if opened from a specific card
  useEffect(() => {
    if (isSiteVisitOpen) {
      document.body.style.overflow = 'hidden';
      setSubmitted(false);
      setErrors({});
      let defaultLoc = 'Darbhanga';
      if (siteVisitInitialData.location) {
        defaultLoc = siteVisitInitialData.location;
      } else if (siteVisitInitialData.propertyId) {
        const found = properties.find(p => p.id === siteVisitInitialData.propertyId || p.slug === siteVisitInitialData.propertyId);
        if (found) defaultLoc = found.location.split(',')[0].trim();
      }

      // Default date tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];

      setFormData(prev => ({
        ...prev,
        location: defaultLoc,
        date: dateStr,
      }));
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSiteVisitOpen) {
        closeSiteVisitModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSiteVisitOpen, siteVisitInitialData, properties, closeSiteVisitModal]);

  if (!isSiteVisitOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = language === 'hi' ? 'कृपया अपना नाम दर्ज करें।' : 'Please enter your full name.';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.phone = language === 'hi' ? 'कृपया एक मान्य 10-अंकीय मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!formData.location) {
      errs.location = language === 'hi' ? 'कृपया लोकेशन चुनें।' : 'Please select an interested location.';
    }

    if (!formData.date) {
      errs.date = language === 'hi' ? 'कृपया तारीख चुनें।' : 'Please select a preferred date.';
    }

    if (!formData.preferredTime) {
      errs.preferredTime = language === 'hi' ? 'कृपया समय चुनें।' : 'Please select a preferred time slot.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    try {
      // Build WhatsApp message format:
      // "Hello Satya Yadav, I would like to book a site visit for the [LOCATION] property. My name is [NAME]. Preferred date: [DATE]. Preferred time: [TIME]."
      const waMsg = `Hello Satya Yadav, I would like to book a site visit for the ${formData.location} property. My name is ${formData.name}. Preferred date: ${formData.date}. Preferred time: ${formData.preferredTime}.${formData.plotRequirement ? ` Requirement: ${formData.plotRequirement}.` : ''}${formData.message ? ` Note: ${formData.message}` : ''}`;
      const waUrl = `https://wa.me/919718526796?text=${encodeURIComponent(waMsg)}`;
      setGeneratedWhatsAppUrl(waUrl);

      // Post to backend API
      const res = await fetch('/api/site-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          location: formData.location,
          date: formData.date,
          preferredTime: formData.preferredTime,
          plotRequirement: formData.plotRequirement,
          message: formData.message,
          propertyId: siteVisitInitialData.propertyId || 'general'
        })
      });

      if (res.ok) {
        setSubmitted(true);
        // Trigger celebratory confetti
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
        const data = await res.json();
        setErrors({ form: data.error || 'Failed to submit site visit. Please reach via WhatsApp.' });
      }
    } catch {
      // Fallback
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/90 flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-5 flex items-center justify-between border-b border-stone-800">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              Smriti Vihar Property Consultation
            </span>
            <h2 className="text-xl font-extrabold text-white">
              {t.siteVisitHeading}
            </h2>
          </div>

          <button
            onClick={closeSiteVisitModal}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            id="close-site-visit-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-stone-900 mb-1">
                  {t.bookingSuccessTitle}
                </h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  {t.bookingSuccessSub}
                </p>
              </div>

              {/* Factual Consultant Confirmation Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-left text-xs space-y-1.5 text-stone-700">
                <div><span className="font-bold">Consultant:</span> {settings.ownerName} (+91 9718526796)</div>
                <div><span className="font-bold">Location:</span> {formData.location}</div>
                <div><span className="font-bold">Date & Time:</span> {formData.date} ({formData.preferredTime})</div>
              </div>

              {/* Direct WhatsApp Trigger Button */}
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={generatedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="site-visit-open-whatsapp-now"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.sendWhatsAppNow}</span>
                </a>

                <button
                  type="button"
                  onClick={closeSiteVisitModal}
                  className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-800 font-semibold"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errors.form && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {errors.form}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {t.fullName} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    id="site-visit-name-input"
                    className={`w-full text-sm pl-10 pr-3 py-2.5 rounded-xl border ${
                      errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300 bg-stone-50'
                    } focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {t.mobileNumber} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="text-xs font-bold text-stone-500 absolute left-3.5 top-3.5">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                    placeholder="9876543210"
                    id="site-visit-phone-input"
                    className={`w-full text-sm pl-12 pr-3 py-2.5 rounded-xl border ${
                      errors.phone ? 'border-rose-400 bg-rose-50/30' : 'border-stone-300 bg-stone-50'
                    } focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
              </div>

              {/* Interested Location */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  {t.interestedLocation} <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  id="site-visit-location-select"
                  className="w-full text-sm px-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-stone-800"
                >
                  <option value="Darbhanga">Darbhanga (Near Airport / ₹1,800/sq.ft.)</option>
                  <option value="Madhubani">Madhubani (Near Railway Station / ₹900/sq.ft.)</option>
                  <option value="Pandaul">Pandaul (Near Market / ₹1,000/sq.ft.)</option>
                  <option value="Jhanjharpur">Jhanjharpur (Near Market / ₹1,300/sq.ft.)</option>
                </select>
              </div>

              {/* Date & Time Slot in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {t.preferredDate} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      id="site-visit-date-input"
                      className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  {errors.date && <p className="text-[11px] text-rose-600 mt-1">{errors.date}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {t.preferredTime} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    id="site-visit-time-select"
                    className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (12:00 PM - 03:00 PM)">Afternoon (12:00 PM - 03:00 PM)</option>
                    <option value="Evening (03:00 PM - 06:00 PM)">Evening (03:00 PM - 06:00 PM)</option>
                  </select>
                </div>
              </div>

              {/* Requirement & Note */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {t.plotRequirement}
                  </label>
                  <input
                    type="text"
                    value={formData.plotRequirement}
                    onChange={(e) => setFormData({ ...formData, plotRequirement: e.target.value })}
                    placeholder="e.g. 1500 sq.ft. / 1 Kattha"
                    id="site-visit-requirement-input"
                    className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {t.messageOptional}
                  </label>
                  <input
                    type="text"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Any specific question"
                    id="site-visit-message-input"
                    className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                id="submit-site-visit-btn"
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-extrabold text-sm sm:text-base transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 text-stone-950" />
                    <span>{t.submitBooking}</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-stone-500 text-center">
                Submitting will record your request and prepare a WhatsApp message for Satya Yadav.
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
