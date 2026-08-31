import React from 'react';
import { RotateCcw, Filter, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface FilterState {
  location: string;
  propertyType: string;
  priceRange: string;
  availability: string;
  sortBy: string;
}

interface PropertyFilterProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset: () => void;
  totalResults: number;
}

export const PropertyFilter: React.FC<PropertyFilterProps> = ({
  filters,
  setFilters,
  onReset,
  totalResults,
}) => {
  const { t } = useApp();

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const isFiltered = 
    filters.location !== 'all' || 
    filters.propertyType !== 'all' || 
    filters.priceRange !== 'all' || 
    filters.availability !== 'all' ||
    filters.sortBy !== 'default';

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm sm:text-base">
              Filter & Sort Properties
            </h3>
            <p className="text-xs text-stone-500">
              Showing <span className="font-bold text-stone-800">{totalResults}</span> {totalResults === 1 ? 'plot' : 'plots'}
            </p>
          </div>
        </div>

        {isFiltered && (
          <button
            onClick={onReset}
            id="reset-filters-button"
            className="self-start md:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors border border-amber-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetFilters}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
        
        {/* Location Filter */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            {t.location}
          </label>
          <select
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            id="filter-location-select"
            className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
          >
            <option value="all">{t.allLocations}</option>
            <option value="darbhanga">Darbhanga</option>
            <option value="madhubani">Madhubani</option>
            <option value="pandaul">Pandaul</option>
            <option value="jhanjharpur">Jhanjharpur</option>
          </select>
        </div>

        {/* Property Type Filter */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            {t.propertyType}
          </label>
          <select
            value={filters.propertyType}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            id="filter-property-type-select"
            className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
          >
            <option value="all">{t.allTypes}</option>
            <option value="residential">Residential Plot</option>
            <option value="house_building">House Building Plot</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            {t.priceRange}
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            id="filter-price-range-select"
            className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
          >
            <option value="all">All Prices</option>
            <option value="under_1000">Under ₹1,000 / sq.ft.</option>
            <option value="1000_1500">₹1,000 – ₹1,500 / sq.ft.</option>
            <option value="above_1500">Above ₹1,500 / sq.ft.</option>
          </select>
        </div>

        {/* Availability Filter */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            {t.availability}
          </label>
          <select
            value={filters.availability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
            id="filter-availability-select"
            className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
          >
            <option value="all">All Status</option>
            <option value="Available">{t.available}</option>
            <option value="On Hold">{t.onHold}</option>
            <option value="Sold">{t.sold}</option>
          </select>
        </div>

        {/* Sort By Filter */}
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Sort By
          </label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            id="filter-sort-by-select"
            className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium"
          >
            <option value="default">Default Order</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="location_asc">Location: A to Z</option>
          </select>
        </div>

      </div>
    </div>
  );
};
