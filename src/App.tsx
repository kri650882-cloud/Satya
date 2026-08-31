import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileStickyBar } from './components/MobileStickyBar';
import { SiteVisitModal } from './components/SiteVisitModal';
import { EnquiryModal } from './components/EnquiryModal';
import { HomePage } from './pages/HomePage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { ComparePage } from './pages/ComparePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { GeminiChatbot } from './components/GeminiChatbot';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Property } from './types';

function MainApp() {
  const { properties, openSiteVisitModal, isChatOpen, closeChatbot, chatInitialPrompt } = useApp();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Track currently selected property for detail view
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Sync route on popstate and path changes
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);

      // Check if property detail path (e.g. /property/darbhanga)
      if (path.startsWith('/property/')) {
        const slug = path.replace('/property/', '').trim();
        const found = properties.find((p) => p.slug === slug || p.id === slug);
        if (found) {
          setSelectedProperty(found);
        }
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [properties]);

  // Navigate helper
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (path.startsWith('/property/')) {
      const slug = path.replace('/property/', '').trim();
      const found = properties.find((p) => p.slug === slug || p.id === slug);
      if (found) {
        setSelectedProperty(found);
      }
    } else if (path === '/book-site-visit') {
      openSiteVisitModal();
    } else if (path === '/properties' || path === '/locations') {
      const el = document.getElementById(path === '/locations' ? 'locations-section' : 'featured-properties-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectProperty = (prop: Property) => {
    setSelectedProperty(prop);
    navigate(`/property/${prop.slug}`);
  };

  // Determine what view to render based on path
  const renderView = () => {
    // Admin routes
    if (currentPath === '/admin' || currentPath === '/admin/login' || currentPath.startsWith('/admin')) {
      return <AdminDashboard navigate={navigate} />;
    }

    // Property Detail route
    if (currentPath.startsWith('/property/') && selectedProperty) {
      return <PropertyDetailPage property={selectedProperty} navigate={navigate} />;
    }

    // If property route was hit directly by URL but selectedProperty was resolved
    if (currentPath.startsWith('/property/')) {
      const slug = currentPath.replace('/property/', '').trim();
      const found = properties.find((p) => p.slug === slug || p.id === slug);
      if (found) {
        return <PropertyDetailPage property={found} navigate={navigate} />;
      }
    }

    // Compare
    if (currentPath === '/compare') {
      return <ComparePage navigate={navigate} onSelectProperty={handleSelectProperty} />;
    }

    // Favorites
    if (currentPath === '/favorites') {
      return <FavoritesPage navigate={navigate} onSelectProperty={handleSelectProperty} />;
    }

    // Contact & Site Visit
    if (currentPath === '/contact' || currentPath === '/book-site-visit') {
      return <ContactPage />;
    }

    // Legal Pages
    if (currentPath === '/disclaimer') {
      return <LegalPage type="disclaimer" navigate={navigate} />;
    }
    if (currentPath === '/privacy-policy') {
      return <LegalPage type="privacy" navigate={navigate} />;
    }
    if (currentPath === '/terms') {
      return <LegalPage type="terms" navigate={navigate} />;
    }

    // Default Home / Properties / Locations
    return (
      <HomePage 
        navigate={navigate} 
        onSelectProperty={handleSelectProperty} 
      />
    );
  };

  const isAdmin = currentPath.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-500 selection:text-stone-950">
      
      {/* Global Header (Hidden only on Admin dashboard) */}
      {!isAdmin && <Header navigate={navigate} currentPath={currentPath} />}

      {/* Main View */}
      <main className="flex-grow">
        {renderView()}
      </main>

      {/* Global Footer */}
      {!isAdmin && <Footer navigate={navigate} />}

      {/* Global Site Visit Modal */}
      <SiteVisitModal />

      {/* Global Enquiry Modal */}
      <EnquiryModal />

      {/* Gemini AI Plot Advisor Chatbot */}
      {!isAdmin && (
        <GeminiChatbot
          isOpen={isChatOpen}
          onClose={closeChatbot}
          initialPrompt={chatInitialPrompt}
        />
      )}

      {/* Sticky Bottom Quick Action Bar for Mobile */}
      {!isAdmin && (
        <MobileStickyBar currentPropertyId={selectedProperty?.id} />
      )}

    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainApp />
      </AppProvider>
    </ErrorBoundary>
  );
}
