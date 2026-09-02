// Centralized Property Image Management & Mapping for SMRITI VIHAR
// Supports real original property photographs, multi-photo galleries,
// responsive image delivery, and graceful placeholders.

export interface PropertyImageMapping {
  propertyId: string;
  slug: string;
  location: string;
  coverImage: string;
  galleryImages: string[];
  isOriginal: boolean; // true if real photograph provided by owner, false if pending
  caption?: string;
}

// Registry of property images
// When original images are uploaded (via Admin Dashboard or into /public/images/<location>/),
// they map directly here.
export const PROPERTY_IMAGES: Record<string, PropertyImageMapping> = {
  darbhanga: {
    propertyId: "darbhanga",
    slug: "darbhanga",
    location: "Darbhanga, Bihar",
    coverImage: "/images/darbhanga/cover.jpg",
    galleryImages: [
      "/images/darbhanga/cover.jpg",
      "/images/darbhanga/photo-1.jpg",
      "/images/darbhanga/photo-2.jpg"
    ],
    isOriginal: false, // will flip to true when original file exists or is uploaded
    caption: "Darbhanga Residential Plot — Near Darbhanga Airport"
  },
  madhubani: {
    propertyId: "madhubani",
    slug: "madhubani",
    location: "Madhubani, Bihar",
    coverImage: "/images/madhubani/cover.jpg",
    galleryImages: [
      "/images/madhubani/cover.jpg",
      "/images/madhubani/photo-1.jpg",
      "/images/madhubani/photo-2.jpg"
    ],
    isOriginal: false,
    caption: "Madhubani Residential Plot — Near Railway Station"
  },
  pandaul: {
    propertyId: "pandaul",
    slug: "pandaul",
    location: "Pandaul, Madhubani, Bihar",
    coverImage: "/images/pandaul/cover.jpg",
    galleryImages: [
      "/images/pandaul/cover.jpg",
      "/images/pandaul/photo-1.jpg",
      "/images/pandaul/photo-2.jpg"
    ],
    isOriginal: false,
    caption: "Pandaul Residential Plot — Near Pandaul Market"
  },
  jhanjharpur: {
    propertyId: "jhanjharpur",
    slug: "jhanjharpur",
    location: "Jhanjharpur, Bihar",
    coverImage: "/images/jhanjharpur/cover.jpg",
    galleryImages: [
      "/images/jhanjharpur/cover.jpg",
      "/images/jhanjharpur/photo-1.jpg",
      "/images/jhanjharpur/photo-2.jpg"
    ],
    isOriginal: false,
    caption: "Jhanjharpur Residential Plot — 50 ft Road Frontage"
  }
};

/**
 * Checks whether an image URL represents an old AI-generated artifact.
 * Old AI images have the timestamp `17881469` or contain `plot_` with timestamp.
 */
export function isOldAiImage(url?: string): boolean {
  if (!url) return false;
  return url.includes('17881469') || url.includes('hero_plots_bihar');
}

/**
 * Determines whether an image is considered a real, authentic photograph.
 * Uploads, local camera photos, or custom original assets are marked as original.
 */
export function isOriginalPhoto(url?: string): boolean {
  if (!url) return false;
  if (isOldAiImage(url)) return false;
  if (url.includes('placeholder')) return false;
  // Uploaded via admin or saved in location folders
  if (url.includes('/uploads/') || url.includes('/darbhanga/') || url.includes('/madhubani/') || url.includes('/pandaul/') || url.includes('/jhanjharpur/')) {
    return true;
  }
  // Base64 user uploads from admin
  if (url.startsWith('data:image/')) {
    return true;
  }
  return false;
}

/**
 * Gets the clean, sanitized display images for a property.
 * If only old AI images exist, returns clean neutral placeholder.
 */
export function getCleanPropertyImages(prop: {
  id?: string;
  slug?: string;
  coverImage?: string;
  images?: string[];
  location?: string;
}): {
  coverImage: string;
  galleryImages: string[];
  isOriginal: boolean;
} {
  const slugKey = (prop.slug || prop.id || '').toLowerCase();
  const mapping = PROPERTY_IMAGES[slugKey];

  // 1. Check if the property already has valid non-AI images specified in database/store
  const customCover = prop.coverImage;
  const customImages = (prop.images && prop.images.length > 0) ? prop.images : [];

  const nonAiCover = customCover && !isOldAiImage(customCover) ? customCover : null;
  const nonAiGallery = customImages.filter(img => !isOldAiImage(img));

  if (nonAiCover) {
    const isOrig = isOriginalPhoto(nonAiCover);
    return {
      coverImage: nonAiCover,
      galleryImages: nonAiGallery.length > 0 ? nonAiGallery : [nonAiCover],
      isOriginal: isOrig
    };
  }

  // 2. Check mapping registry
  if (mapping && mapping.coverImage && !isOldAiImage(mapping.coverImage)) {
    return {
      coverImage: mapping.coverImage,
      galleryImages: mapping.galleryImages.filter(img => !isOldAiImage(img)),
      isOriginal: mapping.isOriginal
    };
  }

  // 3. Fallback to clean neutral placeholder
  const placeholderUrl = `/images/placeholder_${slugKey || 'property'}.svg`;
  return {
    coverImage: placeholderUrl,
    galleryImages: [placeholderUrl],
    isOriginal: false
  };
}
