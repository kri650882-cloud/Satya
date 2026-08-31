import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  Lock
} from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { t, settings, getWhatsAppLink, getCallLink } = useApp();

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 pt-16 pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-stone-800/80">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-black">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
                </svg>
              </div>
              <div>
                <span className="font-brand text-2xl font-bold tracking-wider text-amber-100 block">
                  {settings.brandName}
                </span>
                <span className="text-[10px] tracking-widest text-amber-400 font-semibold uppercase block">
                  {t.propertyConsultant}
                </span>
              </div>
            </div>

            <p className="text-sm text-stone-400 leading-relaxed max-w-md">
              {settings.tagline} Verified residential plots suitable for building independent homes across Darbhanga, Madhubani, Pandaul & Jhanjharpur.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                id="footer-whatsapp-link"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={getCallLink()}
                id="footer-call-link"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/90 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors"
              >
                <Phone className="w-4 h-4 fill-stone-950" />
                <span>+91 9718526796</span>
              </a>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-amber-400 transition-colors">
                  {t.navHome}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/properties')} className="hover:text-amber-400 transition-colors">
                  {t.navProperties}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/locations')} className="hover:text-amber-400 transition-colors">
                  {t.navLocations}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/compare')} className="hover:text-amber-400 transition-colors">
                  {t.navCompare}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/favorites')} className="hover:text-amber-400 transition-colors">
                  {t.navFavorites}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/book-site-visit')} className="hover:text-amber-400 transition-colors text-amber-400 font-semibold">
                  {t.bookSiteVisit}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Locations & Legal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
              Locations & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button onClick={() => navigate('/property/darbhanga')} className="hover:text-amber-400 transition-colors">
                  Darbhanga Plot (Airport Rd)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/property/madhubani')} className="hover:text-amber-400 transition-colors">
                  Madhubani Plot (Station Rd)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/property/pandaul')} className="hover:text-amber-400 transition-colors">
                  Pandaul Plot (Market Rd)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/property/jhanjharpur')} className="hover:text-amber-400 transition-colors">
                  Jhanjharpur Plot (Market Rd)
                </button>
              </li>
              <li className="pt-2">
                <button onClick={() => navigate('/privacy-policy')} className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-amber-400 transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/disclaimer')} className="hover:text-amber-400 transition-colors text-amber-300 font-medium">
                  Disclaimer
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Owner / Contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-stone-800 pb-2">
              Direct Contact
            </h4>
            <div className="space-y-3 text-xs text-stone-400">
              <div>
                <div className="font-bold text-stone-200">{settings.ownerName}</div>
                <div className="text-[11px] text-amber-400">{settings.role}</div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="tel:+919718526796" className="hover:text-white transition-colors">
                  +91 9718526796
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="mailto:satyayadav@gmail.com" className="hover:text-white transition-colors break-all">
                  {settings.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Madhubani & Darbhanga, Bihar</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/admin/login')}
                  className="inline-flex items-center gap-1.5 text-stone-500 hover:text-amber-400 text-[11px] transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin Access</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer Box */}
        <div className="py-6 border-b border-stone-800/80 text-[11px] text-stone-500 leading-relaxed">
          <p className="font-semibold text-stone-400 mb-1">
            Important Consumer Notice:
          </p>
          <p>
            {t.footerDisclaimer}
          </p>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 {settings.brandName} ({settings.domain}). {t.allRightsReserved}
          </div>
          <div className="flex items-center gap-4">
            <span>Consultant: Satya Yadav</span>
            <span>•</span>
            <span>Domain: smritivihar.com</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
