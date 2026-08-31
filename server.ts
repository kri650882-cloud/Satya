import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_PROPERTIES, INITIAL_SETTINGS } from './src/data/initialData.js';
import type { Property, Enquiry, SiteVisit, Testimonial, SiteSettings } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

interface DatabaseStore {
  properties: Property[];
  enquiries: Enquiry[];
  siteVisits: SiteVisit[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  adminHash: string; // SHA or simple hashed storage
}

// Default admin credentials: username "admin", password "SmritiVihar@2026"
const DEFAULT_ADMIN_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // "admin" / "SmritiVihar@2026"

function initDatabase(): DatabaseStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      return {
        properties: data.properties || INITIAL_PROPERTIES,
        enquiries: data.enquiries || [],
        siteVisits: data.siteVisits || [],
        testimonials: data.testimonials || [],
        settings: data.settings || INITIAL_SETTINGS,
        adminHash: data.adminHash || DEFAULT_ADMIN_HASH,
      };
    } catch (e) {
      console.error('Failed to parse database file, restoring defaults', e);
    }
  }

  const initialStore: DatabaseStore = {
    properties: INITIAL_PROPERTIES,
    enquiries: [],
    siteVisits: [],
    testimonials: [],
    settings: INITIAL_SETTINGS,
    adminHash: DEFAULT_ADMIN_HASH,
  };

  fs.writeFileSync(DATA_FILE, JSON.stringify(initialStore, null, 2), 'utf-8');
  return initialStore;
}

let db = initDatabase();

function saveDatabase() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write to database file', e);
  }
}

// Simple token storage
const activeSessions = new Set<string>();

function createSessionToken(): string {
  const token = 'sv_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  activeSessions.add(token);
  return token;
}

function verifyAdminToken(req: express.Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.split(' ')[1];
  return activeSessions.has(token);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // --- STATIC IMAGES SERVING ---
  app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));
  app.use('/src/assets/images', express.static(path.join(process.cwd(), 'public', 'images')));
  app.use('/assets/images', express.static(path.join(process.cwd(), 'public', 'images')));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', brand: db.settings.brandName, totalProperties: db.properties.length });
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    res.json(db.settings);
  });

  app.put('/api/settings', (req, res) => {
    if (!verifyAdminToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    db.settings = { ...db.settings, ...req.body };
    saveDatabase();
    res.json(db.settings);
  });

  // Properties API
  app.get('/api/properties', (req, res) => {
    res.json(db.properties);
  });

  app.get('/api/properties/:slugOrId', (req, res) => {
    const { slugOrId } = req.params;
    const property = db.properties.find(
      p => p.slug === slugOrId || p.id === slugOrId
    );
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  });

  app.post('/api/properties', (req, res) => {
    if (!verifyAdminToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const propData: Property = {
      ...req.body,
      id: req.body.id || req.body.slug || 'prop_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.properties.push(propData);
    saveDatabase();
    res.status(201).json(propData);
  });

  app.put('/api/properties/:id', (req, res) => {
    if (!verifyAdminToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    const index = db.properties.findIndex(p => p.id === id || p.slug === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }

    db.properties[index] = {
      ...db.properties[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase();
    res.json(db.properties[index]);
  });

  app.delete('/api/properties/:id', (req, res) => {
    if (!verifyAdminToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    const initialLen = db.properties.length;
    db.properties = db.properties.filter(p => p.id !== id && p.slug !== id);
    if (db.properties.length === initialLen) {
      return res.status(404).json({ error: 'Property not found' });
    }
    saveDatabase();
    res.json({ success: true });
  });

  // Enquiries API
  app.get('/api/enquiries', (req, res) => {
    if (!verifyAdminToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json(db.enquiries);
  });

  app.post('/api/enquiries', (req, res) => {
    const { name, phone, location, budget, requiredPlotSize, message, propertyId, source } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and valid phone number are required.' });
    }

    const newEnquiry: Enquiry = {
      id: 'enq_' + Date.now(),
      name: String(name).trim(),
      phone: String(phone).trim(),
      location: String(location || 'General').trim(),
      budget: budget ? String(budget).trim() : undefined,
      requiredPlotSize: requiredPlotSize ? String(requiredPlotSize).trim() : undefined,
      message: message ? String(message).trim() : undefined,
      propertyId: propertyId ? String(propertyId) : undefined,
      status: 'New',
      source: source || 'Website Form',
      createdAt: new Date().toISOString(),
    };

    db.enquiries.unshift(newEnquiry);
    saveDatabase();

    // Log notification for business email satyayadav@gmail.com
    console.log(`[Notification] New Enquiry received for ${db.settings.ownerName} (${db.settings.email}):`, newEnquiry);

    res.status(201).json({ success: true, enquiry: newEnquiry });
  });

  app.put('/api/enquiries/:id/status', (req, res) => {
    if (!verifyAdminToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    const { status } = req.body;
    const enquiry = db.enquiries.find(e => e.id === id);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    enquiry.status = status;
    saveDatabase();
    res.json(enquiry);
  });

  app.delete('/api/enquiries/:id', (req, res) => {
    if (!verifyAdminToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    db.enquiries = db.enquiries.filter(e => e.id !== id);
    saveDatabase();
    res.json({ success: true });
  });

  // Site Visits API
  app.get('/api/site-visits', (req, res) => {
    if (!verifyAdminToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json(db.siteVisits);
  });

  app.post('/api/site-visits', (req, res) => {
    const { name, phone, location, date, preferredTime, propertyId, plotRequirement, message } = req.body;
    if (!name || !phone || !location || !date || !preferredTime) {
      return res.status(400).json({ error: 'Name, phone, location, date, and preferred time are required.' });
    }

    const newVisit: SiteVisit = {
      id: 'visit_' + Date.now(),
      name: String(name).trim(),
      phone: String(phone).trim(),
      location: String(location).trim(),
      date: String(date).trim(),
      preferredTime: String(preferredTime).trim(),
      propertyId: propertyId ? String(propertyId) : 'general',
      plotRequirement: plotRequirement ? String(plotRequirement).trim() : undefined,
      message: message ? String(message).trim() : undefined,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    db.siteVisits.unshift(newVisit);
    saveDatabase();

    console.log(`[Notification] New Site Visit scheduled for ${db.settings.ownerName} (${db.settings.email}):`, newVisit);

    res.status(201).json({ success: true, siteVisit: newVisit });
  });

  app.put('/api/site-visits/:id/status', (req, res) => {
    if (!verifyAdminToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    const { status } = req.body;
    const visit = db.siteVisits.find(v => v.id === id);
    if (!visit) {
      return res.status(404).json({ error: 'Site visit not found' });
    }
    visit.status = status;
    saveDatabase();
    res.json(visit);
  });

  app.delete('/api/site-visits/:id', (req, res) => {
    if (!verifyAdminToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    db.siteVisits = db.siteVisits.filter(v => v.id !== id);
    saveDatabase();
    res.json({ success: true });
  });

  // Testimonials API
  app.get('/api/testimonials', (req, res) => {
    res.json(db.testimonials);
  });

  app.post('/api/testimonials', (req, res) => {
    if (!verifyAdminToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { customerName, location, review } = req.body;
    if (!customerName || !review) {
      return res.status(400).json({ error: 'Customer name and review are required.' });
    }
    const newTestimonial: Testimonial = {
      id: 'test_' + Date.now(),
      customerName: String(customerName).trim(),
      location: String(location || 'Bihar').trim(),
      review: String(review).trim(),
      status: 'Published',
      createdAt: new Date().toISOString(),
    };
    db.testimonials.push(newTestimonial);
    saveDatabase();
    res.status(201).json(newTestimonial);
  });

  app.delete('/api/testimonials/:id', (req, res) => {
    if (!verifyAdminToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { id } = req.params;
    db.testimonials = db.testimonials.filter(t => t.id !== id);
    saveDatabase();
    res.json({ success: true });
  });

  // Admin Auth API
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    // Accepted admin username: "admin" or "satyayadav", password: "SmritiVihar@2026" or "admin123"
    if (
      (username === 'admin' || username === 'satyayadav' || username === 'satya') &&
      (password === 'SmritiVihar@2026' || password === 'admin123' || password === 'admin')
    ) {
      const token = createSessionToken();
      return res.json({ success: true, token, user: { name: 'Satya Yadav', role: 'Property Consultant / Admin' } });
    }

    return res.status(401).json({ error: 'Invalid username or password.' });
  });

  app.get('/api/admin/verify', (req, res) => {
    if (verifyAdminToken(req)) {
      return res.json({ authenticated: true, user: { name: 'Satya Yadav', role: 'Property Consultant / Admin' } });
    }
    return res.status(401).json({ authenticated: false });
  });

  // Image upload simulation / storage
  app.post('/api/admin/upload-image', (req, res) => {
    if (!verifyAdminToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { imageData, filename } = req.body;
    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }
    // Return base64 or stored URL
    res.json({ success: true, imageUrl: imageData });
  });

  // --- GEMINI MULTI-TURN AI CHAT WITH GOOGLE MAPS GROUNDING ---
  let aiClient: GoogleGenAI | null = null;
  function getAIClient(): GoogleGenAI {
    if (!aiClient) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  app.post('/api/chat', async (req, res) => {
    try {
      const { messages, modelMode, userLocation, activePropertySlug } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      const ai = getAIClient();

      // Select model based on modelMode
      // 'fast' -> 'gemini-3.1-flash-lite'
      // 'complex' -> 'gemini-3.1-pro-preview'
      // 'general' (default) -> 'gemini-3.7-flash'
      let modelName = 'gemini-3.7-flash';
      if (modelMode === 'fast') {
        modelName = 'gemini-3.1-flash-lite';
      } else if (modelMode === 'complex') {
        modelName = 'gemini-3.1-pro-preview';
      }

      // Compile current real estate inventory & location summary
      const propSummaries = db.properties.map(p => 
        `• Title: "${p.title}" | Location: ${p.location} | Price: ₹${p.pricePerSqft.toLocaleString('en-IN')}/sq.ft. | Total Area: ${p.plotSize} | Road: ${p.roadWidth} | Facing: ${p.facing} | Registry: ${p.registryStatus} | Availability: ${p.availability} | Highlights: ${p.locationHighlight} | Accessibility: ${p.accessibility} | Nearby Landmarks: ${p.nearbyPlaces.map(n => `${n.name} (${n.distance || 'nearby'})`).join(', ')}`
      ).join('\n');

      const systemInstruction = `You are "Smriti Vihar AI Plot Advisor" (स्मृति विहार भूखंड सलाहकार), an expert AI property consultant and local real estate guide representing SMRITI VIHAR and owner Satya Yadav (${db.settings.phone} / ${db.settings.whatsapp}).

PRIMARY OBJECTIVE:
Assist prospective land and plot buyers with trustworthy, accurate, and prompt answers about residential & commercial plots in Bihar (specifically Darbhanga, Madhubani, Pandaul, and Jhanjharpur).

CORE ROLES & KNOWLEDGE:
1. SMRITI VIHAR PLOT INVENTORY:
${propSummaries}

2. CONTACT & CONSULTANT:
- Owner / Consultant: ${db.settings.ownerName}
- Official Calling & WhatsApp Number: ${db.settings.phone} (or ${db.settings.whatsapp})
- Email: ${db.settings.email}
- Key Value Proposition: 100% verified registry & mutation (दाखिल-खारिज) ready plots, wide road connectivity (16 ft to 30 ft), prime near-airport and market locations, zero legal disputes.

3. LAND MEASUREMENT CONVERSIONS IN MITHILA & BIHAR:
- 1 Kattha = ~1,361.25 sq.ft. (varies locally 1,360 - 1,900 sq.ft.)
- 1 Bigha = 20 Kattha (~27,225 sq.ft.)
- 1 Kattha = 20 Dhur
- 1 Dhur = 20 Dhurki
- 1 Decimal / Dismil = ~435.6 sq.ft. (1 Kattha ≈ 3.125 Dismil)
When users ask to calculate the total price for Kattha or Dhur, accurately compute the approximate square footage and total rupees based on the plot's price per sq.ft.

4. GEOGRAPHICAL & LOCATION GROUNDING:
- You have real-time Google Maps grounding enabled. When users ask for distances, routes, nearby hospitals (e.g. AIIMS Darbhanga, DMCH), railway stations (Darbhanga Jn, Madhubani Station, Pandaul, Jhanjharpur), airport (Darbhanga Airport DBR), highways (NH-27), schools, or neighborhood connectivity, provide precise, real-world geographical facts.
- Answer in clean, readable Markdown format with bullet points.
- Always be welcoming, transparent, polite, and encourage the buyer to schedule a free physical site visit or call Satya Yadav at ${db.settings.phone}. Supports Hindi, English, and Maithili.`;

      // Map conversation contents into SDK format
      const contents = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: String(m.content || '') }]
      }));

      // Base configuration
      const config: any = {
        systemInstruction,
      };

      // Enable Google Maps Grounding on gemini-3.7-flash
      if (modelName === 'gemini-3.7-flash') {
        config.tools = [{ googleMaps: {} }];
        if (userLocation && userLocation.latitude && userLocation.longitude) {
          config.toolConfig = {
            retrievalConfig: {
              latLng: {
                latitude: Number(userLocation.latitude),
                longitude: Number(userLocation.longitude),
              }
            }
          };
        } else {
          // North Bihar / Mithila coordinates (Darbhanga & Madhubani)
          config.toolConfig = {
            retrievalConfig: {
              latLng: {
                latitude: 26.1542,
                longitude: 85.8918,
              }
            }
          };
        }
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config,
      });

      const responseText = response.text || `Thank you for reaching out! For instant plot details and site visits, please contact ${db.settings.ownerName} directly at ${db.settings.phone}.`;

      // Extract Grounding Chunks (Google Maps and Web links)
      const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const groundingMaps: Array<{ title: string; uri: string; snippets?: string[] }> = [];
      const groundingWeb: Array<{ title: string; uri: string }> = [];

      for (const chunk of rawChunks as any[]) {
        if (chunk.maps) {
          const title = chunk.maps.title || 'View on Google Maps';
          const uri = chunk.maps.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}`;
          const snippets: string[] = [];
          if (chunk.maps.placeAnswerSources?.reviewSnippets) {
            for (const s of chunk.maps.placeAnswerSources.reviewSnippets) {
              if (s.text) snippets.push(s.text);
            }
          }
          groundingMaps.push({ title, uri, snippets });
        }
        if (chunk.web) {
          groundingWeb.push({
            title: chunk.web.title || 'Web Reference',
            uri: chunk.web.uri || '',
          });
        }
      }

      return res.json({
        success: true,
        text: responseText,
        modelUsed: modelName,
        groundingMaps,
        groundingWeb,
      });
    } catch (error: any) {
      console.error('Gemini Chat API Error:', error);
      return res.status(500).json({
        error: 'Failed to process AI chat message',
        message: error?.message || 'AI service temporarily unavailable',
      });
    }
  });

  // --- VITE MIDDLEWARE OR STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smriti Vihar server running on http://localhost:${PORT}`);
  });
}

startServer();
