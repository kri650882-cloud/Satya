import React, { useState, useEffect } from 'react';
import { Sparkles, ImageOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g. 'aspect-video', 'aspect-4/3'
  fallbackSrc?: string;
  showAiBadge?: boolean;
  aiBadgeText?: string;
  onClick?: () => void;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  aspectRatio = 'aspect-video',
  fallbackSrc = '/images/hero_plots_bihar_1788146973356.jpg',
  showAiBadge = true,
  aiBadgeText,
  onClick
}) => {
  const { t } = useApp();
  const [loading, setLoading] = useState(true);
  const [errorCount, setErrorCount] = useState(0);
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc);

  // Sync when src prop changes
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
      // Try local fallback image
      setErrorCount(1);
      setCurrentSrc(fallbackSrc);
    } else {
      // Both original and fallback failed
      setErrorCount(2);
      setLoading(false);
    }
  };

  const badgeLabel = aiBadgeText || t.aiRepresentativeBadge || "AI Representative Image";

  return (
    <div 
      className={`relative w-full ${aspectRatio} overflow-hidden bg-stone-900 select-none ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-stone-800 animate-pulse flex items-center justify-center z-10">
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
        /* Image Unavailable Fallback Container */
        <div className="absolute inset-0 bg-stone-900 border border-stone-800 flex flex-col items-center justify-center p-4 text-center text-stone-400 z-10">
          <div className="p-3 rounded-2xl bg-stone-800/80 text-amber-400 mb-2 border border-stone-700/60">
            <ImageOff className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-stone-300">
            {t.imageUnavailable || "Property Image Unavailable"}
          </span>
          <span className="text-[10px] text-stone-500 mt-0.5">
            {alt}
          </span>
        </div>
      )}

      {/* AI Representative Image Badge */}
      {showAiBadge && errorCount < 2 && (
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-950/95 text-[10px] sm:text-[11px] font-bold text-amber-300 border border-amber-500/40 shadow-md">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{badgeLabel}</span>
          </span>
        </div>
      )}
    </div>
  );
};
