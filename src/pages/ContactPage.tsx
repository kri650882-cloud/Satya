import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Clock, 
  User, 
  CalendarCheck,
  Building2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ContactPage: React.FC = () => {
  const { t, language, settings, getWhatsAppLink, getCallLink, openSiteVisitModal } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: 'Darbhanga',
    budget: '',
    requiredPlotSize: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError(t.nameRequiredError || 'Please enter your full name.');
      return;
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError(t.invalidPhoneError || 'Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'Contact Page Form'
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSubmitted(true);
          try {
            confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
        } else {
          setError(t.enquiryErrorGeneral || 'Something went wrong. Please try again or contact us on WhatsApp.');
        }
      } else {
        setError(t.enquiryErrorGeneral || 'Something went wrong. Please try again or contact us on WhatsApp.');
      }
    } catch {
      setError(t.enquiryErrorGeneral || 'Something went wrong. Please try again or contact us on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 pb-28 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Building2 className="w-3.5 h-3.5 text-amber-700" />
            <span>{t.directAdvisory}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {t.contactHeading}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-2">
            {t.contactSub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Consultant Profile Card */}
            <div className="bg-stone-950 text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase font-bold text-amber-400 tracking-wider block">
                  {t.propertyConsultant}
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {settings.ownerName}
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  {settings.brandName} • {language === 'hi' ? 'बिहार' : 'Bihar'}
                </p>
              </div>

              <div className="space-y-4 text-sm text-stone-300 border-t border-stone-800 pt-5">
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-stone-900 text-amber-400 shrink-0 mt-0.5 border border-stone-800">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 block font-semibold">{t.phoneCall}</span>
                    <a href={getCallLink()} className="font-bold text-white hover:text-amber-400 transition-colors">
                      +91 9718526796
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 shrink-0 mt-0.5 border border-emerald-800">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 block font-semibold">{t.whatsAppChat}</span>
                    <a 
                      href={getWhatsAppLink()} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      +91 9718526796 (Instant Query)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-stone-900 text-amber-400 shrink-0 mt-0.5 border border-stone-800">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 block font-semibold">{t.emailAddress}</span>
                    <a href="mailto:satyayadav@gmail.com" className="font-bold text-white hover:text-amber-400 transition-colors break-all">
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-stone-900 text-amber-400 shrink-0 mt-0.5 border border-stone-800">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 block font-semibold">{t.officeLocation}</span>
                    <span className="font-medium text-stone-200">
                      {t.biharMithila}
                    </span>
                  </div>
                </div>

              </div>

              <div className="pt-2">
                <button
                  onClick={() => openSiteVisitModal()}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>{t.bookSiteVisit}</span>
                </button>
              </div>
            </div>

            {/* Factual Transparency Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm text-xs text-stone-600 space-y-2">
              <h3 className="font-bold text-stone-900 text-sm">
                {language === 'hi' ? 'सीधा व निष्पक्ष परामर्श' : 'Direct & Unbiased Advice'}
              </h3>
              <p>
                {language === 'hi'
                  ? 'स्मृति विहार आवासीय घर बनाने वाले परिवारों के लिए वास्तविक जमीन समाधान प्रदान करता है। दर, सड़क माप और दस्तावेज पूरी तरह पारदर्शी हैं।'
                  : 'Smriti Vihar focuses on genuine land solutions for families planning to build private homes. All pricing, road measurements, and legal records are openly verified prior to transactions.'}
              </p>
            </div>

          </div>

          {/* Right Column: Contact Enquiry Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
            
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-stone-900">
                  {t.enquirySuccessTitle}
                </h2>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  {t.enquirySuccessSub}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center gap-2 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t.whatsAppChat}</span>
                  </a>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', location: 'Darbhanga', budget: '', requiredPlotSize: '', message: '' });
                    }}
                    className="px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm transition-colors"
                  >
                    {language === 'hi' ? 'नया संदेश भेजें' : 'Send Another Message'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 mb-1">
                    {language === 'hi' ? 'पूछताछ संदेश भेजें' : 'Send an Inquiry Message'}
                  </h2>
                  <p className="text-xs text-stone-500 mb-6">
                    {language === 'hi' 
                      ? 'नीचे अपना विवरण भरें और हम प्लॉट की जानकारी के साथ संपर्क करेंगे।' 
                      : 'Fill in your details below and we will get back to you with plot specifics.'}
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {t.fullName} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.fullNamePlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {t.mobileNumber} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder={t.mobilePlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Location Select */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {t.interestedLocation}
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Darbhanga">Darbhanga (दरभंगा)</option>
                    <option value="Madhubani">Madhubani (मधुबनी)</option>
                    <option value="Pandaul">Pandaul / Sakri (सकरी / पंडौल)</option>
                    <option value="Jhanjharpur">Jhanjharpur (झंझारपुर)</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    {t.messageLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.messagePlaceholder}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-stone-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? t.submitting : t.submitEnquiry}</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
