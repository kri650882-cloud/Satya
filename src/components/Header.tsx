import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  MessageCircle, 
  Menu, 
  X, 
  Heart, 
  Layers, 
  Globe, 
  ShieldCheck, 
  Home, 
  MapPin, 
  Info, 
  Mail,
  Lock,
  Sparkles,
  CalendarCheck
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { 
    language, 
    setLanguage, 
    t, 
    settings, 
    favorites, 
    comparedProperties, 
    getWhatsAppLink, 
    getCallLink,
    openChatbot,
    openSiteVisitModal
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t.navHome, path: '/', icon: Home },
    { name: t.navProperties, path: '/properties', icon: MapPin },
    { name: t.navLocations, path: '/locations', icon: MapPin },
    { name: t.navCompare, path: '/compare', icon: Layers, badge: comparedProperties.length },
    { name: t.navFavorites, path: '/favorites', icon: Heart, badge: favorites.length },
    { name: t.navAbout, path: '/about', icon: Info },
    { name: t.navContact, path: '/contact', icon: Mail },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-stone-950 border-b border-stone-800 text-stone-100 transition-all">
      {/* Top micro bar */}
      <div className="bg-stone-900/90 px-4 py-1.5 text-xs text-stone-400 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-stone-300 truncate max-w-[280px] sm:max-w-none">
              {language === 'hi' 
                ? 'दरभंगा, मधुबनी, सकरी/पंडौल और झंझारपुर में सत्यापित आवासीय प्लॉट उपलब्ध' 
                : 'Verified residential plots available across Darbhanga, Madhubani, Pandaul & Jhanjharpur'}
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="hidden sm:inline text-stone-400">
              {settings.ownerName} ({t.propertyConsultant})
            </span>
            <button
              onClick={() => handleNavClick('/admin/login')}
              className="text-stone-400 hover:text-amber-400 text-xs flex items-center gap-1 transition-colors"
              title="Admin Portal"
              id="header-admin-link"
            >
              <Lock className="w-3 h-3" />
              <span>{t.navAdmin}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('/')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo-button"
          >
            {/* Elegant Monogram */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-md shadow-amber-950/40 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
                  <path d="M9 21V12h6v9" />
                  <path d="M12 7.5v.01" />
                </svg>
                <div className="absolute inset-0 bg-amber-400/10 pointer-events-none"></div>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="font-brand text-xl sm:text-2xl font-bold tracking-wider text-amber-100 group-hover:text-amber-300 transition-colors">
                {settings.brandName}
              </span>
              <span className="text-[10px] tracking-widest text-amber-400/90 font-semibold uppercase -mt-0.5">
                {t.propertyConsultant}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  id={`nav-link-${link.path.replace('/', '') || 'home'}`}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    isActive 
                      ? 'text-amber-300 bg-stone-800 shadow-sm border border-amber-500/20' 
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <span>{link.name}</span>
                  {typeof link.badge === 'number' && link.badge > 0 && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-stone-950 bg-amber-400 rounded-full min-w-[18px]">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: AI Advisor, Language Switcher, Call CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* AI Advisor Button */}
            <button
              onClick={() => openChatbot()}
              id="header-ai-advisor-btn"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold text-xs border border-amber-500/30 transition-all shadow-sm group"
              title="Open AI Plot & Location Advisor"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
              <span>{t.askAiAdvisor}</span>
            </button>

            {/* Language Switcher (EN | हिंदी) */}
            <div className="flex items-center bg-stone-900 p-1 rounded-xl border border-stone-800 shadow-inner" id="header-lang-switcher">
              <button
                onClick={() => setLanguage('en')}
                id="header-lang-en"
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'en' 
                    ? 'bg-amber-500 text-stone-950 shadow-md ring-1 ring-amber-400' 
                    : 'text-stone-400 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                id="header-lang-hi"
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === 'hi' 
                    ? 'bg-amber-500 text-stone-950 shadow-md ring-1 ring-amber-400' 
                    : 'text-stone-400 hover:text-white'
                }`}
                title="हिंदी"
              >
                हिंदी
              </button>
            </div>

            {/* Call Now Header CTA */}
            <a
              href={getCallLink()}
              id="header-call-btn"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-stone-950 font-extrabold text-xs transition-all shadow-md shadow-amber-950/30"
              title="Call Satya Yadav"
            >
              <Phone className="w-3.5 h-3.5 fill-stone-950" />
              <span>{t.callNow}</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 sm:hidden">
            {/* Mobile Lang Button */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-stone-800 text-amber-300 border border-stone-700"
              id="mobile-quick-lang-toggle"
            >
              {language === 'en' ? 'हिंदी' : 'EN'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800"
              id="mobile-menu-toggle-btn"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-950 border-b border-stone-800 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200" id="mobile-menu-drawer">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-2">
            <button
              onClick={() => setLanguage('en')}
              className={`py-2 px-3 rounded-xl text-xs font-bold text-center border ${
                language === 'en'
                  ? 'bg-amber-500 text-stone-950 border-amber-400'
                  : 'bg-stone-900 text-stone-400 border-stone-800'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`py-2 px-3 rounded-xl text-xs font-bold text-center border ${
                language === 'hi'
                  ? 'bg-amber-500 text-stone-950 border-amber-400'
                  : 'bg-stone-900 text-stone-400 border-stone-800'
              }`}
            >
              हिंदी (Hindi)
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                      : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-amber-400" />
                    <span>{link.name}</span>
                  </div>
                  {typeof link.badge === 'number' && link.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-extrabold text-stone-950 bg-amber-400 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openChatbot();
              }}
              className="py-2.5 px-3 rounded-xl bg-stone-900 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.askAiAdvisor}</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openSiteVisitModal();
              }}
              className="py-2.5 px-3 rounded-xl bg-amber-500 text-stone-950 text-xs font-extrabold flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-stone-950" />
              <span>{t.bookSiteVisit}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
