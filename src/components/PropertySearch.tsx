import React from 'react';
import { Search, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PropertySearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearchSubmit?: () => void;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
}) => {
  const { t } = useApp();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (onSearchSubmit) onSearchSubmit();
    }
  };

  const handleClear = () => {
    setSearchTerm('');
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto shadow-xl rounded-2xl bg-white p-2 border border-stone-200">
      <div className="flex items-center gap-2">
        <div className="pl-3 text-stone-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.searchPlaceholder}
          id="hero-property-search-input"
          className="w-full py-3 px-2 text-stone-800 placeholder-stone-400 bg-transparent text-sm sm:text-base focus:outline-none"
        />

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
            title={t.clearSearch}
            id="clear-search-button"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => onSearchSubmit && onSearchSubmit()}
          id="hero-search-action-button"
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-colors whitespace-nowrap shadow-sm"
        >
          {t.searchButton}
        </button>
      </div>

      {/* Quick location search suggestions pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-2.5 px-3 border-t border-stone-100 mt-2 text-xs text-stone-500">
        <span className="font-semibold text-stone-600">Quick:</span>
        {['Darbhanga', 'Madhubani', 'Pandaul', 'Jhanjharpur'].map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setSearchTerm(loc)}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              searchTerm.toLowerCase() === loc.toLowerCase()
                ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
};
