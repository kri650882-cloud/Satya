import React, { useState, useEffect } from 'react';
import { Camera, Sparkles, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g. 'aspect-video', 'aspect-4/3'
  fallbackSrc?: string;
  showAiBadge?: boolean;
  isOriginal?: boolean;
  aiBadgeText?: string;
  onClick?: () => void;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  aspectRatio = 'aspect-video',
  fallbackSrc = '/images/placeholder_property.svg',
  showAiBadge = true, // Default true to display AI Representative Image label as requested
  isOriginal = false,
  aiBadgeText,
  onClick
}) => {
  const { t, language } = useApp();
  const [loading, setLoading] = useState(true);
  const [errorCount, setErrorCount] = useState(0);

  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc);

  useEffect(() => {
    setCurrentSrc(src || fallbackSrc);
    setErrorCount(0);
    setLoading(true);
  }, [src, fallbackSrc]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    if (errorCount === 0 && fallbackSrc && currentSrc !== fallbackSrc) {
      // Try local fallback
      setErrorCount(1);
      setCurrentSrc(fallbackSrc);
    } else {
      // Both failed
      setErrorCount(2);
      setLoading(false);
    }
  };

  const badgeText = aiBadgeText || (language === 'hi' ? 'AI प्रतिनिधि चित्र' : 'AI Representative Image');

  return (
    <div 
      className={`relative w-full ${aspectRatio} overflow-hidden bg-stone-900 select-none ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Loading Skeleton */}
      {loading && errorCount < 2 && (
        <div className="absolute inset-0 bg-stone-900/90 animate-pulse flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2 text-stone-500 text-xs">
            <div className="w-8 h-8 rounded-full border-2 border-amber-500/40 border-t-amber-400 animate-spin"></div>
          </div>
        </div>
      )}

      {/* Image Display */}
      {errorCount < 2 ? (
        <img
          src={currentSrc}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`${className} transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          loading="lazy"
        />
      ) : (
        /* Branded Fallback Card */
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 border border-stone-800 flex flex-col items-center justify-center p-6 text-center z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-black tracking-wider text-white uppercase font-serif">
            SATYA YADAV
          </span>
          <span className="text-[10px] tracking-widest text-amber-400/90 uppercase font-semibold mt-0.5">
            Property Consultant
          </span>
          <span className="text-[11px] text-stone-400 mt-2 line-clamp-1 max-w-[85%]">
            {alt}
          </span>
        </div>
      )}

      {/* Badges: Original Photo vs AI Representative Image */}
      {errorCount < 2 && !loading && (
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          {isOriginal ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-950/85 backdrop-blur-sm text-[10px] font-bold text-emerald-400 border border-emerald-500/40 shadow-md">
              <Camera className="w-3 h-3 text-emerald-400" />
              <span>{t.originalPhotoBadge || (language === 'hi' ? 'मूल फोटो' : 'Original Photo')}</span>
            </span>
          ) : showAiBadge ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-950/85 backdrop-blur-sm text-[10px] font-medium text-stone-200 border border-stone-700/60 shadow-md">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{badgeText}</span>
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
};

