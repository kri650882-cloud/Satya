import { Property, SiteSettings } from '../types';

export const INITIAL_SETTINGS: SiteSettings = {
  brandName: "SATYA YADAV",
  ownerName: "Satya Yadav",
  role: "Property Consultant",
  phone: "+91 9718526796",
  whatsapp: "+91 9718526796",
  email: "satyayadav@gmail.com",
  domain: "satyayadav.in",
  tagline: "Find Your Perfect Plot. Build Your Dream Home.",
  hindiHeadline: "Madhubani, Darbhanga, Pandaul & Jhanjharpur में अपने सपनों का घर बनाने के लिए सही Plot खोजें।",
  heroDescription: "Premium residential plots in Darbhanga, Madhubani, Pandaul & Jhanjharpur. Explore locations, compare prices and book a site visit.",
  metaTitle: "Satya Yadav | Residential Plots in Darbhanga, Madhubani & Bihar",
  metaDescription: "Explore residential and house-building plots in Darbhanga, Madhubani, Pandaul and Jhanjharpur with Satya Yadav. Check property details, enquire and book a site visit.",
  smtpEnabled: false,
  smtpEmail: "satyayadav@gmail.com"
};

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "darbhanga",
    title: "Prime Residential Plot in Darbhanga",
    slug: "darbhanga",
    location: "Darbhanga, Bihar",
    locationHighlight: "Near Darbhanga Airport — approximately 3 km",
    accessibility: "Main Road Connected",
    propertyType: "Residential Plot / House Building Plot",
    plotNumber: "D-101",
    plotSize: "Large Plot — Details Available on Request",
    pricePerSqft: 1800,
    roadWidth: "60 ft — Demo/Editable",
    facing: "East — Demo/Editable",
    registryStatus: "Registry Available",
    availability: "Available",
    description: "This prime residential plot in Darbhanga is suitable for buyers looking to build an independent family home or private villa. Features convenient access to main roads and close proximity to Darbhanga Airport. Registry documents are available for verification upon request.",
    nearbyPlaces: [
      { name: "Darbhanga Airport", distance: "Approx. 3 km", type: "Airport" },
      { name: "Main Road Connectivity", distance: "Direct access", type: "Transit" }
    ],
    mapDestination: "Darbhanga Airport, Bihar, India",
    mapType: "Approximate Location",
    coverImage: "/images/plot_darbhanga.jpg",
    images: [
      "/images/plot_darbhanga.jpg",
      "/images/hero_plots_bihar.jpg"
    ],
    isDemoFields: true,
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-30T10:00:00.000Z"
  },
  {
    id: "madhubani",
    title: "Prime Residential Plot in Madhubani",
    slug: "madhubani",
    location: "Madhubani, Bihar",
    locationHighlight: "Near Madhubani Railway Station — approximately 5 km",
    accessibility: "Main Road Connected",
    propertyType: "Residential Plot / House Building Plot",
    plotNumber: "M-101",
    plotSize: "Large Plot — Details Available on Request",
    pricePerSqft: 900,
    roadWidth: "40 ft — Demo/Editable",
    facing: "East — Demo/Editable",
    registryStatus: "Registry Available",
    availability: "Available",
    description: "Ideal residential plot located in Madhubani, well-suited for building an independent home in a calm neighborhood with strong arterial road connectivity. Situated approximately 5 km from Madhubani Railway Station with clear registry records available.",
    nearbyPlaces: [
      { name: "Madhubani Railway Station", distance: "Approx. 5 km", type: "Railway" },
      { name: "Main Road Connectivity", distance: "Direct access", type: "Transit" }
    ],
    mapDestination: "Madhubani Railway Station, Madhubani, Bihar, India",
    mapType: "Approximate Location",
    coverImage: "/images/plot_madhubani.jpg",
    images: [
      "/images/plot_madhubani.jpg",
      "/images/hero_plots_bihar.jpg"
    ],
    isDemoFields: true,
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-30T10:00:00.000Z"
  },
  {
    id: "pandaul",
    title: "Residential Plot in Pandaul",
    slug: "pandaul",
    location: "Pandaul, Madhubani, Bihar",
    locationHighlight: "Near Pandaul Market",
    accessibility: "Market Road",
    propertyType: "Residential Plot / House Building Plot",
    plotNumber: "P-101",
    plotSize: "Large Plot — Details Available on Request",
    pricePerSqft: 1000,
    roadWidth: "40 ft — Demo/Editable",
    facing: "North — Demo/Editable",
    registryStatus: "Registry Available",
    availability: "Available",
    description: "Excellent residential land in Pandaul conveniently situated near the local market center. Ideal for prospective homeowners seeking everyday convenience, market road access, and serene residential surroundings with verified registry availability.",
    nearbyPlaces: [
      { name: "Pandaul Market", distance: "Walking distance / nearby", type: "Market" },
      { name: "Market Road", distance: "Direct frontage", type: "Transit" }
    ],
    mapDestination: "Pandaul Market, Pandaul, Madhubani, Bihar, India",
    mapType: "Approximate Location",
    coverImage: "/images/plot_pandaul.jpg",
    images: [
      "/images/plot_pandaul.jpg",
      "/images/hero_plots_bihar.jpg"
    ],
    isDemoFields: true,
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-30T10:00:00.000Z"
  },
  {
    id: "jhanjharpur",
    title: "Residential Plot in Jhanjharpur",
    slug: "jhanjharpur",
    location: "Jhanjharpur, Bihar",
    locationHighlight: "Near Jhanjharpur Market",
    accessibility: "Market Road",
    propertyType: "Residential Plot / House Building Plot",
    plotNumber: "J-101",
    plotSize: "Large Plot — Details Available on Request",
    pricePerSqft: 1300,
    roadWidth: "50 ft — Demo/Editable",
    facing: "East — Demo/Editable",
    registryStatus: "Registry Available",
    availability: "Available",
    description: "Spacious residential plot located in Jhanjharpur with 50 ft wide road frontage. Strategically placed near the key market district, this plot offers an outstanding location to build a family residence. Verified title and registry documents ready for inspection.",
    nearbyPlaces: [
      { name: "Jhanjharpur Market", distance: "Short drive / nearby", type: "Market" },
      { name: "Market Road", distance: "Direct frontage", type: "Transit" }
    ],
    mapDestination: "Jhanjharpur Market, Jhanjharpur, Bihar, India",
    mapType: "Approximate Location",
    coverImage: "/images/plot_jhanjharpur.jpg",
    images: [
      "/images/plot_jhanjharpur.jpg",
      "/images/hero_plots_bihar.jpg"
    ],
    isDemoFields: true,
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-30T10:00:00.000Z"
  }
];
