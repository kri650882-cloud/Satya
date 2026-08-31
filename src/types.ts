export type PropertyAvailability = 'Available' | 'On Hold' | 'Sold';

export interface NearbyPlace {
  name: string;
  distance?: string;
  type?: string;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  location: string;
  locationHighlight: string;
  accessibility: string;
  propertyType: string;
  plotNumber: string;
  plotSize: string;
  pricePerSqft: number;
  roadWidth: string;
  facing: string;
  registryStatus: string;
  availability: PropertyAvailability;
  description: string;
  nearbyPlaces: NearbyPlace[];
  mapDestination: string;
  mapType: 'Approximate Location' | 'Exact Location';
  coverImage: string;
  images: string[];
  isDemoFields?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Follow-up' | 'Closed';

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  location: string;
  budget?: string;
  requiredPlotSize?: string;
  message?: string;
  propertyId?: string;
  status: EnquiryStatus;
  source: string;
  createdAt: string;
}

export type SiteVisitStatus = 'New' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface SiteVisit {
  id: string;
  name: string;
  phone: string;
  propertyId: string;
  location: string;
  date: string;
  preferredTime: string;
  plotRequirement?: string;
  message?: string;
  status: SiteVisitStatus;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  location: string;
  review: string;
  status: 'Published' | 'Pending';
  createdAt: string;
}

export interface SiteSettings {
  brandName: string;
  ownerName: string;
  role: string;
  phone: string;
  whatsapp: string;
  email: string;
  domain: string;
  tagline: string;
  hindiHeadline: string;
  heroDescription: string;
  metaTitle: string;
  metaDescription: string;
  smtpEnabled?: boolean;
  smtpEmail?: string;
}

export interface GroundingMapSource {
  title: string;
  uri: string;
  snippets?: string[];
}

export interface GroundingWebSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  groundingMaps?: GroundingMapSource[];
  groundingWeb?: GroundingWebSource[];
  isError?: boolean;
}

export type ModelMode = 'general' | 'fast' | 'complex';

export type Language = 'en' | 'hi';
