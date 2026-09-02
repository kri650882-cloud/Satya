import React from 'react';
import { useApp } from '../context/AppContext';
import { Property } from '../types';
import { SafeImage } from '../components/SafeImage';
import { getCleanPropertyImages } from '../data/propertyImages';
import { 
  Layers, 
  X, 
  Trash2, 
  CalendarCheck, 
  MessageCircle, 
  Plus, 
  ArrowRight, 
  Sparkles,
  CheckCircle,
  MapPin,
  Send,
  Eye
} from 'lucide-react';

interface ComparePageProps {
  navigate: (path: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({ navigate, onSelectProperty }) => {
  const { 
    t, 
    language,
    comparedProperties: comparedIds, 
    toggleCompare, 
    clearCompare, 
    properties, 
    getWhatsAppLink, 
    openSiteVisitModal,
    openEnquiryModal
  } = useApp();

  const comparedList = properties.filter((p) => comparedIds.includes(p.id));
  const availableToAdd = properties.filter((p) => !comparedIds.includes(p.id));

  return (
    <div className="min-h-screen bg-stone-50 py-10 pb-28 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5 text-amber-700" />
              <span>{language === 'hi' ? 'विशेषता तुलना' : 'Side-by-Side Analysis'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900">
              {t.compareTitle}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {language === 'hi' 
                ? 'अधिकतम 3 प्लॉट की विशेषताओं, सड़क की चौड़ाई और दरों की तुलना करें।' 
                : 'Compare specifications, road connectivity, and rates for up to 3 plots.'}
            </p>
          </div>

          {comparedList.length > 0 && (
            <button
              onClick={clearCompare}
              id="clear-all-compare-btn"
              className="self-start md:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearAll}</span>
            </button>
          )}
        </div>

        {/* Content */}
        {comparedList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Layers className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-stone-900 mb-2">
              {t.noPropertiesCompared}
            </h2>
            <p className="text-sm text-stone-500 mb-6 max-w-md mx-auto">
              {t.selectComparePrompt}
            </p>
            <button
              onClick={() => navigate('/properties')}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md transition-colors"
            >
              {t.exploreProperties}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Quick add selector if under 3 */}
            {comparedList.length < 3 && availableToAdd.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-900 font-semibold">
                  <Plus className="w-4 h-4 text-amber-700" />
                  <span>
                    {language === 'hi' 
                      ? `आप ${3 - comparedList.length} और प्लॉट जोड़ सकते हैं:` 
                      : `You can compare ${3 - comparedList.length} more plot${3 - comparedList.length > 1 ? 's' : ''}:`}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableToAdd.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => toggleCompare(p.id)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <span>+ {p.location.split(',')[0]} (₹{p.pricePerSqft})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Comparison Table */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/70">
                    <th className="p-4 sm:p-5 w-1/4 text-xs font-bold text-stone-500 uppercase tracking-wider">
                      {t.specification}
                    </th>
                    {comparedList.map((prop) => (
                      <th key={prop.id} className="p-4 sm:p-5 w-1/4 align-top relative">
                        <div className="relative">
                          <button
                            onClick={() => toggleCompare(prop.id)}
                            className="absolute top-0 right-0 p-1.5 rounded-full bg-stone-100 text-stone-500 hover:bg-rose-100 hover:text-rose-600 transition-colors z-20"
                            title={t.remove}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>

                          {/* Image */}
                          {(() => {
                            const imgData = getCleanPropertyImages(prop);
                            return (
                              <div 
                                className="aspect-video w-full rounded-xl overflow-hidden bg-stone-100 mb-3 cursor-pointer relative"
                                onClick={() => onSelectProperty(prop)}
                              >
                                <SafeImage
                                  src={imgData.coverImage}
                                  alt={prop.title}
                                  aspectRatio="aspect-video"
                                  className="w-full h-full object-cover"
                                  showAiBadge={false}
                                  isOriginal={imgData.isOriginal}
                                  fallbackSrc={`/images/placeholder_${(prop.slug || prop.id).toLowerCase()}.svg`}
                                />
                                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-stone-950/80 text-[9px] text-amber-300 font-semibold">
                                  {prop.location.split(',')[0]}
                                </div>
                              </div>
                            );
                          })()}

                          <h3 
                            onClick={() => onSelectProperty(prop)}
                            className="font-bold text-stone-900 text-sm hover:text-amber-700 transition-colors cursor-pointer line-clamp-1 mb-1"
                          >
                            {prop.title}
                          </h3>

                          <div className="text-base font-extrabold text-amber-600">
                            ₹{prop.pricePerSqft.toLocaleString('en-IN')}
                            <span className="text-xs font-normal text-stone-500"> / sq.ft.</span>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
                  {/* Location */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-stone-500 bg-stone-50/40">
                      {t.location}
                    </td>
                    {comparedList.map((prop) => (
                      <td key={prop.id} className="p-4 sm:p-5 font-medium text-stone-800">
                        {prop.location}
                      </td>
                    ))}
                  </tr>

                  {/* Plot Number */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-stone-500 bg-stone-50/40">
                      {t.plotNumber}
                    </td>
                    {comparedList.map((prop) => (
                      <td key={prop.id} className="p-4 sm:p-5 font-bold text-stone-900">
                        {prop.plotNumber}
                      </td>
                    ))}
                  </tr>

                  {/* Plot Size */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-stone-500 bg-stone-50/40">
                      {t.plotSize}
                    </td>
                    {comparedList.map((prop) => (
                      <td key={prop.id} className="p-4 sm:p-5 font-semibold text-stone-800">
                        {prop.plotSize}
                      </td>
                    ))}
                  </tr>

                  {/* Road Width */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-stone-500 bg-stone-50/40">
                      {t.roadWidth}
                    </td>
                    {comparedList.map((prop) => (
                      <td key={prop.id} className="p-4 sm:p-5 font-semibold text-stone-800">
                        {prop.roadWidth}
                      </td>
                    ))}
                  </tr>

                  {/* Facing */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-stone-500 bg-stone-50/40">
                      {t.facing}
                    </td>
                    {comparedList.map((prop) => (
                      <td key={prop.id} className="p-4 sm:p-5 font-semibold text-stone-800">
                        {prop.facing}
                      </td>
                    ))}
                  </tr>

                  {/* Registry Status */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-stone-500 bg-stone-50/40">
                      {t.registryAvailable}
                    </td>
                    {comparedList.map((prop) => (
                      <td key={prop.id} className="p-4 sm:p-5 font-bold text-emerald-700">
                        ✓ {prop.registryStatus || 'Verified & Ready'}
                      </td>
                    ))}
                  </tr>

                  {/* Availability */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-stone-500 bg-stone-50/40">
                      {t.availability}
                    </td>
                    {comparedList.map((prop) => (
                      <td key={prop.id} className="p-4 sm:p-5">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          prop.availability === 'Available' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : prop.availability === 'On Hold' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {prop.availability}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Key Highlights */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-stone-500 bg-stone-50/40">
                      {t.propertyHighlights}
                    </td>
                    {comparedList.map((prop) => (
                      <td key={prop.id} className="p-4 sm:p-5 text-stone-600 leading-relaxed text-xs">
                        {prop.locationHighlight}
                      </td>
                    ))}
                  </tr>

                  {/* Action Row */}
                  <tr>
                    <td className="p-4 sm:p-5 font-bold text-stone-500 bg-stone-50/40">
                      Action
                    </td>
                    {comparedList.map((prop) => (
                      <td key={prop.id} className="p-4 sm:p-5 space-y-2">
                        <button
                          onClick={() => onSelectProperty(prop)}
                          className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t.viewProperty}</span>
                        </button>

                        <button
                          onClick={() => openEnquiryModal(prop)}
                          className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{t.inquireNow}</span>
                        </button>
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
