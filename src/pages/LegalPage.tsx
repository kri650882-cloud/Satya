import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, FileText, AlertTriangle, ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'disclaimer';
  navigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, navigate }) => {
  const { settings } = useApp();

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-amber-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm space-y-6">
          
          {type === 'disclaimer' && (
            <>
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <div className="p-3 rounded-2xl bg-amber-50 text-amber-700">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                    Important Legal Disclaimer
                  </h1>
                  <p className="text-xs text-stone-500">
                    {settings.brandName} ({settings.domain}) • Satya Yadav (+91 9718526796)
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
                <p className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 font-medium">
                  {settings.brandName} is a residential property consultancy and property advisory service operating in Darbhanga, Madhubani, Pandaul, and Jhanjharpur, Bihar.
                </p>

                <h3 className="text-base font-bold text-stone-900 pt-2">1. Verification of Property Details</h3>
                <p>
                  Property specifications, measurements, road width, facing, landmark distances, and pricing listed on this website are published for general informational guidance. Exact boundaries, land dimensions, and title documents are subject to physical verification against official land records at the concerned sub-registry office.
                </p>

                <h3 className="text-base font-bold text-stone-900 pt-2">2. Buyer Due Diligence</h3>
                <p>
                  Prospective purchasers are strictly advised to physically visit the plot, inspect physical road connectivity, verify mutation / Jamabandi records, and review original registry documents directly with consultant Satya Yadav (+91 9718526796) before executing any purchase agreement or monetary transaction.
                </p>

                <h3 className="text-base font-bold text-stone-900 pt-2">3. No Guaranteed Returns</h3>
                <p>
                  {settings.brandName} makes no claims or guarantees regarding future capital appreciation or speculative returns. Land transactions are intended for personal house-building and residential construction.
                </p>

                <h3 className="text-base font-bold text-stone-900 pt-2">4. AI-Generated Visual Representations</h3>
                <p>
                  Visual images displayed on plot cards are representative AI renderings created to illustrate potential residential development and layout aesthetics. Actual plot site appearances must be evaluated during a physical site inspection.
                </p>
              </div>
            </>
          )}

          {type === 'privacy' && (
            <>
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                    Privacy Policy
                  </h1>
                  <p className="text-xs text-stone-500">
                    Last updated: 2026 • {settings.brandName}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
                <p>
                  At <strong>{settings.brandName}</strong> ({settings.domain}), we respect and safeguard the privacy of our visitors and clients.
                </p>

                <h3 className="text-base font-bold text-stone-900 pt-2">1. Information We Collect</h3>
                <p>
                  When you submit a Site Visit Booking request, Contact Enquiry, or WhatsApp message, we collect your Name, Mobile Number, preferred property location, and any specific notes you provide.
                </p>

                <h3 className="text-base font-bold text-stone-900 pt-2">2. Purpose of Collection</h3>
                <p>
                  Your information is utilized solely by <strong>Satya Yadav</strong> and authorized personnel to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-stone-600">
                  <li>Schedule and coordinate physical plot visits in Bihar.</li>
                  <li>Provide requested pricing, roadmap, and registry documentation information.</li>
                  <li>Communicate via WhatsApp, SMS, or telephone calls regarding your property inquiry.</li>
                </ul>

                <h3 className="text-base font-bold text-stone-900 pt-2">3. Zero Third-Party Selling</h3>
                <p>
                  We <strong>never</strong> sell, lease, trade, or distribute your personal data or phone number to any third-party marketing companies, brokers, or external advertisers.
                </p>

                <h3 className="text-base font-bold text-stone-900 pt-2">4. Local Storage Preferences</h3>
                <p>
                  Your saved property favorites and comparison lists are stored locally in your web browser for your convenience and are not tracked across other websites.
                </p>
              </div>
            </>
          )}

          {type === 'terms' && (
            <>
              <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
                <div className="p-3 rounded-2xl bg-stone-100 text-stone-700">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                    Terms & Conditions
                  </h1>
                  <p className="text-xs text-stone-500">
                    Website usage terms for {settings.domain}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm text-stone-700 leading-relaxed">
                <p>
                  Welcome to <strong>{settings.brandName}</strong>. By accessing or using our website, you agree to comply with and be bound by the following terms of use.
                </p>

                <h3 className="text-base font-bold text-stone-900 pt-2">1. Informational Purpose</h3>
                <p>
                  All content, property cards, rates per sq.ft., and location maps provided on {settings.domain} are for informational assistance only. Listings do not constitute a legally binding offer until a formalized legal contract of sale is executed under Bihar state registration laws.
                </p>

                <h3 className="text-base font-bold text-stone-900 pt-2">2. Availability & Price Updates</h3>
                <p>
                  Plot availability statuses (Available, On Hold, Sold) and prices are subject to periodic revision based on physical plot bookings. {settings.brandName} reserves the right to update or modify listings at any time without prior notice.
                </p>

                <h3 className="text-base font-bold text-stone-900 pt-2">3. Contact for Verification</h3>
                <p>
                  For any questions regarding listings, documentation verification, or terms, contact property consultant Satya Yadav at +91 9718526796 or satyayadav@gmail.com.
                </p>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
