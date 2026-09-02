// Centralized Property Image Management & Mapping for SATYA YADAV - PROPERTY CONSULTANT
// Restores high-quality AI representative images for all 4 locations,
// with support for admin-uploaded original photographs and resilient branded fallbacks.

export interface PropertyImageMapping {
  propertyId: string;
  slug: string;
  location: string;
  coverImage: string;
  galleryImages: string[];
  isOriginal: boolean;
  caption?: string;
}

// Registry of AI Representative Property Images for all 4 locations
export const PROPERTY_IMAGES: Record<string, PropertyImageMapping> = {
  darbhanga: {
    propertyId: "darbhanga",
    slug: "darbhanga",
    location: "Darbhanga, Bihar",
    coverImage: "/images/plot_darbhanga.jpg",
    galleryImages: [
      "/images/plot_darbhanga.jpg",
      "/images/hero_plots_bihar.jpg",
      "/images/plot_darbhanga_1788146916525.jpg"
    ],
    isOriginal: false,
    caption: "Darbhanga Residential Land — Close to Darbhanga Airport & NH"
  },
  madhubani: {
    propertyId: "madhubani",
    slug: "madhubani",
    location: "Madhubani, Bihar",
    coverImage: "/images/plot_madhubani.jpg",
    galleryImages: [
      "/images/plot_madhubani.jpg",
      "/images/hero_plots_bihar.jpg",
      "/images/plot_madhubani_1788146930008.jpg"
    ],
    isOriginal: false,
    caption: "Madhubani Residential Plot — Near Railway Station & District HQ"
  },
  pandaul: {
    propertyId: "pandaul",
    slug: "pandaul",
    location: "Pandaul, Madhubani, Bihar",
    coverImage: "/images/plot_pandaul.jpg",
    galleryImages: [
      "/images/plot_pandaul.jpg",
      "/images/hero_plots_bihar.jpg",
      "/images/plot_pandaul_1788146947558.jpg"
    ],
    isOriginal: false,
    caption: "Pandaul Market Road Plot — High Accessibility & Residential Enclave"
  },
  jhanjharpur: {
    propertyId: "jhanjharpur",
    slug: "jhanjharpur",
    location: "Jhanjharpur, Bihar",
    coverImage: "/images/plot_jhanjharpur.jpg",
    galleryImages: [
      "/images/plot_jhanjharpur.jpg",
      "/images/hero_plots_bihar.jpg",
      "/images/plot_jhanjharpur_1788146960324.jpg"
    ],
    isOriginal: false,
    caption: "Jhanjharpur Sub-division Plot — Wide 50 ft Road Frontage"
  }
};

/**
 * Determines whether an image is considered an authentic original photograph uploaded by the owner.
 */
export function isOriginalPhoto(url?: string): boolean {
  if (!url) return false;
  if (url.includes('placeholder')) return false;
  if (url.includes('plot_') || url.includes('hero_plots')) return false;
  // Uploaded via admin dashboard (base64 or upload path)
  if (url.startsWith('data:image/') || url.includes('/uploads/')) {
    return true;
  }
  return false;
}

/**
 * Gets clean, verified display images for a property.
 * Returns the restored AI representative image or user-uploaded original photo.
 */
export function getCleanPropertyImages(prop: {
  id?: string;
  slug?: string;
  coverImage?: string;
  images?: string[];
  location?: string;
  isOriginalPhoto?: boolean;
}): {
  coverImage: string;
  galleryImages: string[];
  isOriginal: boolean;
} {
  const slugKey = (prop.slug || prop.id || '').toLowerCase();
  const mapping = PROPERTY_IMAGES[slugKey];

  // 1. Check if user explicitly uploaded/marked an original photo
  if (prop.isOriginalPhoto && prop.coverImage) {
    return {
      coverImage: prop.coverImage,
      galleryImages: (prop.images && prop.images.length > 0) ? prop.images : [prop.coverImage],
      isOriginal: true
    };
  }

  // 2. If property has custom non-placeholder images in db
  if (prop.coverImage && !prop.coverImage.includes('placeholder_')) {
    const isOrig = isOriginalPhoto(prop.coverImage);
    const validImages = prop.images && prop.images.length > 0 ? prop.images : [prop.coverImage];
    return {
      coverImage: prop.coverImage,
      galleryImages: validImages,
      isOriginal: isOrig
    };
  }

  // 3. Use restored AI representative images mapped for the location
  if (mapping) {
    return {
      coverImage: mapping.coverImage,
      galleryImages: mapping.galleryImages,
      isOriginal: mapping.isOriginal
    };
  }

  // 4. Default fallback
  return {
    coverImage: `/images/plot_${slugKey || 'darbhanga'}.jpg`,
    galleryImages: [`/images/plot_${slugKey || 'darbhanga'}.jpg`],
    isOriginal: false
  };
}

