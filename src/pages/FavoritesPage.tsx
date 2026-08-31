import React from 'react';
import { useApp } from '../context/AppContext';
import { Property } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { Heart, Trash2, ArrowRight } from 'lucide-react';

interface FavoritesPageProps {
  navigate: (path: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({ navigate, onSelectProperty }) => {
  const { t, language, favorites, properties } = useApp();

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-stone-50 py-10 pb-28 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2 border border-rose-200">
              <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
              <span>{language === 'hi' ? 'सहेजी गई लिस्टिंग' : 'Saved Plots'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900">
              {t.favoritesTitle}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {language === 'hi'
                ? `आपके द्वारा सहेजे गए ${favoriteProperties.length} प्लॉट`
                : `${favoriteProperties.length} plot${favoriteProperties.length === 1 ? '' : 's'} saved to your local list.`}
            </p>
          </div>

          <button
            onClick={() => navigate('/properties')}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-bold transition-colors shadow-sm"
          >
            {t.exploreProperties}
          </button>
        </div>

        {/* Content */}
        {favoriteProperties.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">
              {t.noFavoritesYet}
            </h2>
            <p className="text-sm text-stone-500 mb-6 max-w-md mx-auto">
              {t.noFavoritesSub}
            </p>
            <button
              onClick={() => navigate('/properties')}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition-colors inline-flex items-center gap-2"
            >
              <span>{t.exploreProperties}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {favoriteProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onViewDetails={onSelectProperty}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
