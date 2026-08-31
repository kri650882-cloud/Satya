import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, SiteSettings, Language } from '../types';
import { INITIAL_PROPERTIES, INITIAL_SETTINGS } from '../data/initialData';
import { translations } from '../i18n/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  properties: Property[];
  settings: SiteSettings;
  favorites: string[];
  favoritePropertyIds: string[]; // alias
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  comparedProperties: string[];
  comparedPropertyIds: string[]; // alias
  toggleCompare: (propertyId: string) => boolean;
  isCompared: (propertyId: string) => boolean;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  
  // Enquiry Modal
  isEnquiryOpen: boolean;
  enquiryProperty: Property | null;
  openEnquiryModal: (property?: Property | null) => void;
  closeEnquiryModal: () => void;

  // Site Visit Modal
  isSiteVisitOpen: boolean;
  openSiteVisitModal: (propertyId?: string, location?: string) => void;
  closeSiteVisitModal: () => void;
  siteVisitInitialData: { propertyId?: string; location?: string };

  // Chatbot State
  isChatOpen: boolean;
  chatInitialPrompt: string;
  openChatbot: (prompt?: string) => void;
  closeChatbot: () => void;

  // Admin Auth
  adminToken: string | null;
  adminUser: { name: string; role: string } | null;
  setAdminAuth: (token: string | null, user: { name: string; role: string } | null) => void;
  adminLogin: (password: string) => Promise<boolean>;
  adminLogout: () => void;
  refreshProperties: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  refreshData: () => Promise<void>;

  // Contact Links
  getWhatsAppLink: (property?: Property | null, customMsg?: string) => string;
  getCallLink: () => string;
  getDirectionsLink: (property: Property) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language initialization & persistence
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('sv_lang');
      return (saved === 'hi' || saved === 'en') ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('sv_lang', lang);
    } catch {
      // ignore
    }
  };

  const t = translations[language] || translations['en'];

  // Properties & Settings
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sv_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Comparison list (up to 3)
  const [comparedProperties, setComparedProperties] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sv_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Enquiry Modal State
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryProperty, setEnquiryProperty] = useState<Property | null>(null);

  const openEnquiryModal = (property?: Property | null) => {
    setEnquiryProperty(property || null);
    setIsEnquiryOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsEnquiryOpen(false);
    setEnquiryProperty(null);
  };

  // Site Visit Modal State
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);
  const [siteVisitInitialData, setSiteVisitInitialData] = useState<{ propertyId?: string; location?: string }>({});

  const openSiteVisitModal = (propertyId?: string, location?: string) => {
    setSiteVisitInitialData({ propertyId, location });
    setIsSiteVisitOpen(true);
  };

  const closeSiteVisitModal = () => {
    setIsSiteVisitOpen(false);
    setSiteVisitInitialData({});
  };

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');

  const openChatbot = (prompt?: string) => {
    if (prompt) {
      setChatInitialPrompt(prompt);
    }
    setIsChatOpen(true);
  };

  const closeChatbot = () => {
    setIsChatOpen(false);
    setChatInitialPrompt('');
  };

  // Admin Auth
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('sv_admin_token');
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState<{ name: string; role: string } | null>(() => {
    try {
      const saved = localStorage.getItem('sv_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const setAdminAuth = (token: string | null, user: { name: string; role: string } | null) => {
    setAdminToken(token);
    setAdminUser(user);
    try {
      if (token) {
        localStorage.setItem('sv_admin_token', token);
        localStorage.setItem('sv_admin_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('sv_admin_token');
        localStorage.removeItem('sv_admin_user');
      }
    } catch {
      // ignore
    }
  };

  // Fetch properties and settings from backend
  const refreshData = async () => {
    try {
      const [propRes, setRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/settings')
      ]);

      if (propRes.ok) {
        const propData = await propRes.json();
        if (Array.isArray(propData) && propData.length > 0) {
          setProperties(propData);
        }
      }

      if (setRes.ok) {
        const setData = await setRes.json();
        if (setData && setData.brandName) {
          setSettings(setData);
        }
      }
    } catch (err) {
      console.warn('Using initial data as fallback', err);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Save favorites to local storage
  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const next = prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId];
      try {
        localStorage.setItem('sv_favorites', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  // Compare properties (Max 3)
  const toggleCompare = (propertyId: string): boolean => {
    if (comparedProperties.includes(propertyId)) {
      const next = comparedProperties.filter(id => id !== propertyId);
      setComparedProperties(next);
      try {
        localStorage.setItem('sv_compare', JSON.stringify(next));
      } catch {
        // ignore
      }
      return false;
    } else {
      if (comparedProperties.length >= 3) {
        return false;
      }
      const next = [...comparedProperties, propertyId];
      setComparedProperties(next);
      try {
        localStorage.setItem('sv_compare', JSON.stringify(next));
      } catch {
        // ignore
      }
      return true;
    }
  };

  const isCompared = (propertyId: string) => comparedProperties.includes(propertyId);

  const removeFromCompare = (propertyId: string) => {
    const next = comparedProperties.filter(id => id !== propertyId);
    setComparedProperties(next);
    try {
      localStorage.setItem('sv_compare', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const clearCompare = () => {
    setComparedProperties([]);
    try {
      localStorage.removeItem('sv_compare');
    } catch {
      // ignore
    }
  };

  // WhatsApp link generator (Phone: +91 9718526796)
  const getWhatsAppLink = (property?: Property | null, customMsg?: string): string => {
    const cleanPhone = "919718526796";
    let message = "";

    if (customMsg) {
      message = customMsg;
    } else if (property) {
      const loc = property.location.split(',')[0].trim();
      message = `Hello Satya Yadav, I am interested in the ${loc} plot (${property.title}) listed on Smriti Vihar. Please share complete price, road connectivity, and registry details.`;
    } else {
      message = "Hello Satya Yadav, I am interested in residential plots in Darbhanga / Madhubani / Pandaul / Jhanjharpur. Please share details.";
    }

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Call link generator
  const getCallLink = (): string => {
    return "tel:+919718526796";
  };

  // Google Maps Direction link generator
  const getDirectionsLink = (property: Property): string => {
    const query = encodeURIComponent(property.mapDestination || `${property.location}, Bihar, India`);
    return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        properties,
        settings,
        favorites,
        favoritePropertyIds: favorites,
        toggleFavorite,
        isFavorite,
        comparedProperties,
        comparedPropertyIds: comparedProperties,
        toggleCompare,
        isCompared,
        removeFromCompare,
        clearCompare,
        isEnquiryOpen,
        enquiryProperty,
        openEnquiryModal,
        closeEnquiryModal,
        isSiteVisitOpen,
        openSiteVisitModal,
        closeSiteVisitModal,
        siteVisitInitialData,
        isChatOpen,
        chatInitialPrompt,
        openChatbot,
        closeChatbot,
        adminToken,
        adminUser,
        setAdminAuth,
        adminLogin: async (password: string): Promise<boolean> => {
          try {
            const res = await fetch('/api/admin/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: 'admin', password })
            });
            const data = await res.json();
            if (res.ok && data.token) {
              setAdminAuth(data.token, data.user || { name: 'Satya Yadav', role: 'Owner' });
              return true;
            }
            return false;
          } catch {
            return false;
          }
        },
        adminLogout: () => {
          setAdminAuth(null, null);
        },
        refreshProperties: async () => {
          await refreshData();
        },
        refreshSettings: async () => {
          await refreshData();
        },
        refreshData,
        getWhatsAppLink,
        getCallLink,
        getDirectionsLink
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
