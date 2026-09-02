import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Hero } from '../components/Hero';
import { PropertySearch } from '../components/PropertySearch';
import { PropertyFilter, FilterState } from '../components/PropertyFilter';
import { PropertyCard } from '../components/PropertyCard';
import { LocationsSection } from '../components/LocationsSection';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { HowItWorks } from '../components/HowItWorks';
import { FAQSection } from '../components/FAQSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { Property } from '../types';
import { 
  Building2, 
  MapPin, 
  CalendarCheck, 
  MessageCircle, 
  ArrowRight, 
  PhoneCall, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onSelectProperty }) => {
  const { t, language, properties, settings, getWhatsAppLink, openSiteVisitModal } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    location: 'all',
    propertyType: 'all',
    priceRange: 'all',
    availability: 'all',
    sortBy: 'default'
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      location: 'all',
      propertyType: 'all',
      priceRange: 'all',
      availability: 'all',
      sortBy: 'default'
    });
  };

  const scrollToProperties = () => {
    const el = document.getElementById('featured-properties-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to targeted section if navigated via path or hash
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    let targetId = '';
    if (path === '/locations' || hash === '#locations-section') {
      targetId = 'locations-section';
    } else if (path === '/properties' || hash === '#featured-properties-section') {
      targetId = 'featured-properties-section';
    } else if (hash === '#about-section') {
      targetId = 'about-section';
    }
    if (targetId) {
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, []);

  // Filter & Search Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Search term matching
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesLocation = prop.location.toLowerCase().includes(query);
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesPlotNumber = prop.plotNumber.toLowerCase().includes(query);
        const matchesType = prop.propertyType.toLowerCase().includes(query);
        const matchesHighlight = prop.locationHighlight.toLowerCase().includes(query);
        const matchesSlug = prop.slug.toLowerCase().includes(query);

        if (!matchesLocation && !matchesTitle && !matchesPlotNumber && !matchesType && !matchesHighlight && !matchesSlug) {
          return false;
        }
      }

      // Location filter
      if (filters.location !== 'all') {
        if (!prop.slug.toLowerCase().includes(filters.location.toLowerCase()) && 
            !prop.location.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Property Type filter
      if (filters.propertyType !== 'all') {
        if (filters.propertyType === 'residential' && !prop.propertyType.toLowerCase().includes('residential')) {
          return false;
        }
        if (filters.propertyType === 'house_building' && !prop.propertyType.toLowerCase().includes('house')) {
          return false;
        }
      }

      // Price range filter
      if (filters.priceRange !== 'all') {
        if (filters.priceRange === 'under_1000' && prop.pricePerSqft >= 1000) return false;
        if (filters.priceRange === '1000_1500' && (prop.pricePerSqft < 1000 || prop.pricePerSqft > 1500)) return false;
        if (filters.priceRange === 'above_1500' && prop.pricePerSqft <= 1500) return false;
      }

      // Availability filter
      if (filters.availability !== 'all') {
        if (prop.availability !== filters.availability) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.pricePerSqft - b.pricePerSqft;
      if (filters.sortBy === 'price_desc') return b.pricePerSqft - a.pricePerSqft;
      if (filters.sortBy === 'location_asc') return a.location.localeCompare(b.location);
      return 0;
    });
  }, [properties, searchTerm, filters]);

  return (
    <div className="min-h-screen bg-stone-50">
      
      {/* 2. Hero Section */}
      <Hero onExploreClick={scrollToProperties} />

      {/* 3. Search Box Bar (Overlapping Hero) */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7">
        <PropertySearch
          searchTerm={searchTerm}
          setSearchTerm={(term) => {
            setSearchTerm(term);
            if (term) scrollToProperties();
          }}
          onSearchSubmit={scrollToProperties}
        />
      </div>

      {/* 4. Quick Location Cards Showcase */}
      <LocationsSection onSelectProperty={onSelectProperty} />

      {/* 5. Featured Properties Section */}
      <section className="py-16 sm:py-24 bg-stone-50" id="featured-properties-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
                <Building2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Verified Listings</span>
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
                {t.featuredPropertiesHeading}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Explore currently listed residential land plots with verified connectivity and registry documents.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/compare')}
                className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <span>{t.compare}</span>
              </button>
              <button
                onClick={() => navigate('/favorites')}
                className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <span>{t.navFavorites}</span>
              </button>
            </div>
          </div>

          {/* Filter & Sorting Controls */}
          <PropertyFilter
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            totalResults={filteredProperties.length}
          />

          {/* Property Cards Grid or Empty Search State */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredProperties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop}
                  onViewDetails={onSelectProperty}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-lg mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 mb-2">
                {t.noMatchingProperties}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 mb-6">
                Try clearing your search term or choosing a different location filter such as Darbhanga, Madhubani, Pandaul, or Jhanjharpur.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-colors shadow-sm"
              >
                {t.resetFilters}
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 6. Why Choose Satya Yadav */}
      <WhyChooseUs />

      {/* 8. How It Works */}
      <HowItWorks 
        onExplore={scrollToProperties} 
        onCompare={() => navigate('/compare')} 
        onVisit={() => openSiteVisitModal()} 
      />

      {/* 9. Site Visit Banner CTA */}
      <section className="py-16 sm:py-20 bg-amber-500 text-stone-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-stone-900 bg-amber-400/80 px-3 py-1 rounded-full mb-3">
              Direct Site Visit Service
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-950 tracking-tight leading-tight">
              Ready to Inspect Your Future Plot in Person?
            </h2>
            <p className="text-sm sm:text-base text-stone-900/90 font-medium mt-3">
              Book a scheduled on-site inspection with Satya Yadav. We will walk you through road access, boundaries, and nearby connectivity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => openSiteVisitModal()}
              id="cta-banner-book-visit"
              className="px-6 py-3.5 rounded-xl bg-stone-950 hover:bg-stone-900 text-white font-bold text-sm sm:text-base transition-transform hover:scale-105 shadow-xl flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 text-amber-400" />
              <span>{t.bookSiteVisit}</span>
            </button>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm sm:text-base transition-transform hover:scale-105 shadow-xl flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.whatsAppUs}</span>
            </a>
          </div>
        </div>
      </section>

      {/* 10. About Satya Yadav Section */}
      <section className="py-16 sm:py-24 bg-white border-b border-stone-200" id="about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Column */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 bg-stone-900">
                <img
                  src="/images/hero_plots_bihar.jpg"
                  alt="Satya Yadav Residential Plots"
                  className="w-full h-80 sm:h-96 object-cover opacity-90 block"
                  onError={(e) => {
                    e.currentTarget.src = '/images/placeholder_property.svg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent pointer-events-none"></div>

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-stone-950/95 border border-stone-700 text-white shadow-xl">
                  <div className="text-xs uppercase font-bold text-amber-400">Owner & Property Consultant</div>
                  <div className="text-lg font-bold">{settings.ownerName}</div>
                  <div className="text-xs text-stone-300 mt-1">
                    Phone / WhatsApp: +91 9718526796 • {settings.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Honest Real Estate Advisory</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight">
                {t.aboutHeading}
              </h2>

              <p className="text-base text-stone-700 leading-relaxed">
                {t.aboutContent}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900 block">No False Promises</span>
                    <span className="text-stone-600">Factual details only; we do not make speculative return claims.</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900 block">Verified Registry</span>
                    <span className="text-stone-600">Documentation available for inspection prior to transactions.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => navigate('/contact')}
                  className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold text-xs sm:text-sm transition-colors"
                >
                  {t.navContact}
                </button>

                <a
                  href="tel:+919718526796"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm transition-colors flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{t.talkToOwner}</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Customer Reviews (Honest empty state or published) */}
      <TestimonialsSection />

      {/* 11. FAQ Section */}
      <FAQSection />

      {/* 12. Contact / Trust CTA (Prompt Section 62: "Your Dream Home Starts With the Right Plot") */}
      <section className="py-16 sm:py-24 bg-stone-950 text-white border-t border-stone-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-2">
            {settings.brandName} • Bihar
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.dreamHomeStartsTitle}
          </h2>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto mt-4 leading-relaxed">
            {t.dreamHomeStartsSub}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={scrollToProperties}
              className="px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm sm:text-base transition-all shadow-lg hover:scale-105"
            >
              {t.exploreProperties}
            </button>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base transition-all shadow-lg hover:scale-105 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{t.whatsAppUs}</span>
            </a>

            <a
              href="tel:+919718526796"
              className="px-6 py-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm sm:text-base transition-all border border-stone-700 flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>{t.talkToOwner}</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
