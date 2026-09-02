import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Property, SiteVisit, Enquiry, Testimonial, SiteSettings } from '../types';
import { 
  Building2, 
  CalendarCheck, 
  Mail, 
  Settings, 
  MessageSquare, 
  Plus, 
  Trash2, 
  Edit3, 
  Phone, 
  MessageCircle, 
  Save, 
  Check, 
  X, 
  Lock, 
  LogOut, 
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  Camera,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

interface AdminDashboardProps {
  navigate: (path: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { 
    properties, 
    settings, 
    adminToken, 
    adminLogin, 
    adminLogout, 
    refreshProperties, 
    refreshSettings 
  } = useApp();

  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'properties' | 'siteVisits' | 'enquiries' | 'settings' | 'testimonials'>('properties');

  // Data states
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Property edit modal/state
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [propertyFormData, setPropertyFormData] = useState<Partial<Property>>({});
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);

  // Testimonial new form state
  const [newTestimonial, setNewTestimonial] = useState({ customerName: '', location: '', rating: 5, review: '', date: '' });
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);

  // Fetch admin-protected data when authenticated
  const fetchAllAdminData = async () => {
    if (!adminToken) return;
    setLoadingData(true);
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      
      const [visitsRes, enqRes, testRes] = await Promise.all([
        fetch('/api/site-visits', { headers }),
        fetch('/api/enquiries', { headers }),
        fetch('/api/testimonials')
      ]);

      if (visitsRes.ok) setSiteVisits(await visitsRes.json());
      if (enqRes.ok) setEnquiries(await enqRes.json());
      if (testRes.ok) setTestimonials(await testRes.json());
    } catch {
      // ignore
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      fetchAllAdminData();
      setSettingsForm(settings);
    }
  }, [adminToken, settings]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const ok = await adminLogin(password);
    if (!ok) {
      setLoginError('Invalid admin password. Default demo password is "admin123" or "satya2026".');
    }
  };

  // Property Handlers
  const handleStartEditProperty = (prop: Property) => {
    setEditingProperty(prop);
    setIsCreatingNew(false);
    setPropertyFormData({ ...prop });
  };

  const handleStartCreateProperty = () => {
    setEditingProperty(null);
    setIsCreatingNew(true);
    setPropertyFormData({
      title: '',
      slug: '',
      location: 'Darbhanga, Bihar',
      propertyType: 'Residential Plot',
      pricePerSqft: 1200,
      plotNumber: 'P-101',
      plotSize: 'Details Available on Request',
      roadWidth: '40 ft',
      facing: 'East',
      locationHighlight: 'Main Road Connected',
      description: 'Ideal residential plot located in a peaceful and developing neighbourhood suitable for home construction.',
      availability: 'Available',
      registryStatus: 'Registry Available',
      images: ['/images/placeholder_darbhanga.svg'],
      coverImage: '/images/placeholder_darbhanga.svg',
      mapDestination: 'Darbhanga, Bihar',
      mapType: 'Approximate Location',
      isDemoFields: true,
      nearbyPlaces: [
        { name: 'Main Arterial Road', distance: '100 meters', type: 'Transport' },
        { name: 'Local Market', distance: '1 km', type: 'Market' }
      ]
    });
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving property...');

    try {
      const url = isCreatingNew ? '/api/properties' : `/api/properties/${editingProperty?.id}`;
      const method = isCreatingNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(propertyFormData)
      });

      if (res.ok) {
        setSaveStatus('Property saved successfully!');
        await refreshProperties();
        setTimeout(() => {
          setEditingProperty(null);
          setIsCreatingNew(false);
          setSaveStatus(null);
        }, 800);
      } else {
        const err = await res.json();
        setSaveStatus(`Error: ${err.error || 'Failed to save'}`);
      }
    } catch {
      setSaveStatus('Network error while saving');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) return;
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) {
        await refreshProperties();
      }
    } catch {
      // ignore
    }
  };

  const handleQuickMarkSold = async (prop: Property) => {
    const newStatus = prop.availability === 'Sold' ? 'Available' : 'Sold';
    try {
      const res = await fetch(`/api/properties/${prop.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ ...prop, availability: newStatus })
      });
      if (res.ok) {
        await refreshProperties();
      }
    } catch {
      // ignore
    }
  };

  // Site Visit & Enquiry Status Handlers
  const handleUpdateVisitStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/site-visits/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAllAdminData();
      }
    } catch {
      // ignore
    }
  };

  const handleUpdateEnquiryStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAllAdminData();
      }
    } catch {
      // ignore
    }
  };

  // Settings Save Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving site settings...');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        setSaveStatus('Site settings updated successfully!');
        await refreshSettings();
        setTimeout(() => setSaveStatus(null), 2000);
      }
    } catch {
      setSaveStatus('Error saving settings');
    }
  };

  // Testimonial Handlers
  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          ...newTestimonial,
          date: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
          status: 'Published'
        })
      });
      if (res.ok) {
        setShowAddTestimonial(false);
        setNewTestimonial({ customerName: '', location: '', rating: 5, review: '', date: '' });
        fetchAllAdminData();
      }
    } catch {
      // ignore
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (res.ok) fetchAllAdminData();
    } catch {
      // ignore
    }
  };

  // If not logged in, render Admin Login view
  if (!adminToken) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-stone-900 rounded-3xl p-8 border border-stone-800 shadow-2xl text-white">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center mx-auto mb-3 font-black shadow-lg">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              {settings.brandName} Admin
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Owner Management Portal • Satya Yadav
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (e.g. admin123 or satya2026)"
                id="admin-password-input"
                className="w-full text-sm px-4 py-3 rounded-xl bg-stone-800 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-stone-500 mt-1.5">
                Quick Hint: You can use password <code className="text-amber-400">admin123</code> or <code className="text-amber-400">satya2026</code>.
              </p>
            </div>

            <button
              type="submit"
              id="admin-login-submit-btn"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-colors shadow-md"
            >
              Sign In to Dashboard
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-xs text-stone-400 hover:text-white transition-colors"
              >
                Return to Public Website
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-20">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-stone-950 text-white border-b border-stone-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 font-black flex items-center justify-center text-sm">
              SY
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base text-white block">
                {settings.brandName} Control Center
              </span>
              <span className="text-[10px] text-amber-400 block">
                Logged in as {settings.ownerName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">View Live Site</span>
            </button>

            <button
              onClick={adminLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-100 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto border-t border-stone-800/80">
          <button
            onClick={() => setActiveTab('properties')}
            className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'properties'
                ? 'border-amber-500 text-amber-400 bg-stone-900/50'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Properties ({properties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('siteVisits')}
            className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'siteVisits'
                ? 'border-amber-500 text-amber-400 bg-stone-900/50'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Site Visits ({siteVisits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'enquiries'
                ? 'border-amber-500 text-amber-400 bg-stone-900/50'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Enquiries ({enquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'settings'
                ? 'border-amber-500 text-amber-400 bg-stone-900/50'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Site Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`py-3 px-4 text-xs font-bold whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'testimonials'
                ? 'border-amber-500 text-amber-400 bg-stone-900/50'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reviews Manager</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: PROPERTIES MANAGEMENT */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  Property Listings Management
                </h2>
                <p className="text-xs text-stone-500">
                  Add, modify, change price per sq.ft., or toggle availability status without writing code.
                </p>
              </div>

              <button
                onClick={handleStartCreateProperty}
                id="admin-add-property-btn"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Property Listing</span>
              </button>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold text-xs uppercase">
                    <th className="p-4">Plot & Location</th>
                    <th className="p-4">Price / sq.ft.</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Plot #</th>
                    <th className="p-4">Road Width</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {properties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-stone-50/60 transition-colors">
                      
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={prop.coverImage || prop.images[0]}
                          alt={prop.title}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-stone-900 hover:text-amber-700 cursor-pointer" onClick={() => handleStartEditProperty(prop)}>
                            {prop.title}
                          </div>
                          <div className="text-xs text-stone-500">{prop.location}</div>
                        </div>
                      </td>

                      <td className="p-4 font-black text-amber-700">
                        ₹{prop.pricePerSqft.toLocaleString('en-IN')}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleQuickMarkSold(prop)}
                          title="Click to toggle Available / Sold"
                          className={`px-3 py-1 rounded-full font-bold text-xs transition-colors cursor-pointer ${
                            prop.availability === 'Sold'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : prop.availability === 'On Hold'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {prop.availability === 'Sold' ? '🔴 SOLD' : prop.availability === 'On Hold' ? '🟡 ON HOLD' : '🟢 AVAILABLE'}
                        </button>
                      </td>

                      <td className="p-4 font-bold text-stone-700">
                        {prop.plotNumber}
                      </td>

                      <td className="p-4 text-stone-600">
                        {prop.roadWidth}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleStartEditProperty(prop)}
                          className="p-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs"
                          title="Edit Property"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(prop.id)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs"
                          title="Delete Property"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Property Edit / Create Modal */}
            {(editingProperty || isCreatingNew) && (
              <div className="fixed inset-0 z-50 bg-stone-950/85 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
                <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-2xl w-full p-6 sm:p-8 my-6">
                  
                  <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
                    <h3 className="text-xl font-bold text-stone-900">
                      {isCreatingNew ? 'Add New Property Listing' : `Edit: ${editingProperty?.title}`}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingProperty(null);
                        setIsCreatingNew(false);
                      }}
                      className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProperty} className="space-y-4 text-xs sm:text-sm">
                    
                    {saveStatus && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                        {saveStatus}
                      </div>
                    )}

                    {/* Title & Slug */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-stone-800 mb-1">Listing Title *</label>
                        <input
                          type="text"
                          required
                          value={propertyFormData.title || ''}
                          onChange={(e) => setPropertyFormData({ ...propertyFormData, title: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-800 mb-1">URL Slug (e.g. darbhanga) *</label>
                        <input
                          type="text"
                          required
                          value={propertyFormData.slug || ''}
                          onChange={(e) => setPropertyFormData({ ...propertyFormData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Location & Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-stone-800 mb-1">Location *</label>
                        <input
                          type="text"
                          required
                          value={propertyFormData.location || ''}
                          onChange={(e) => setPropertyFormData({ ...propertyFormData, location: e.target.value })}
                          placeholder="e.g. Darbhanga, Bihar"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-800 mb-1">Price / sq.ft. (₹) *</label>
                        <input
                          type="number"
                          required
                          min={100}
                          value={propertyFormData.pricePerSqft || ''}
                          onChange={(e) => setPropertyFormData({ ...propertyFormData, pricePerSqft: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Availability & Property Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-stone-800 mb-1">Availability Status *</label>
                        <select
                          value={propertyFormData.availability || 'Available'}
                          onChange={(e) => setPropertyFormData({ ...propertyFormData, availability: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white font-semibold"
                        >
                          <option value="Available">🟢 Available</option>
                          <option value="On Hold">🟡 On Hold</option>
                          <option value="Sold">🔴 Sold</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-800 mb-1">Property Type</label>
                        <select
                          value={propertyFormData.propertyType || 'Residential Plot'}
                          onChange={(e) => setPropertyFormData({ ...propertyFormData, propertyType: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white font-semibold"
                        >
                          <option value="Residential Plot">Residential Plot</option>
                          <option value="House Building Plot">House Building Plot</option>
                        </select>
                      </div>
                    </div>

                    {/* Plot #, Road Width, Facing */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-stone-800 mb-1">Plot Number</label>
                        <input
                          type="text"
                          value={propertyFormData.plotNumber || ''}
                          onChange={(e) => setPropertyFormData({ ...propertyFormData, plotNumber: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-800 mb-1">Road Width</label>
                        <input
                          type="text"
                          value={propertyFormData.roadWidth || ''}
                          onChange={(e) => setPropertyFormData({ ...propertyFormData, roadWidth: e.target.value })}
                          placeholder="e.g. 40 ft"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-800 mb-1">Facing</label>
                        <input
                          type="text"
                          value={propertyFormData.facing || ''}
                          onChange={(e) => setPropertyFormData({ ...propertyFormData, facing: e.target.value })}
                          placeholder="e.g. East / North"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Location Highlight & Map Destination */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-stone-800 mb-1">Location Highlight</label>
                        <input
                          type="text"
                          value={propertyFormData.locationHighlight || ''}
                          onChange={(e) => setPropertyFormData({ ...propertyFormData, locationHighlight: e.target.value })}
                          placeholder="e.g. Near Darbhanga Airport — approx. 3 km"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-stone-800 mb-1">Google Maps Query</label>
                        <input
                          type="text"
                          value={propertyFormData.mapDestination || ''}
                          onChange={(e) => setPropertyFormData({ ...propertyFormData, mapDestination: e.target.value })}
                          placeholder="e.g. Darbhanga Airport, Bihar"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={propertyFormData.description || ''}
                        onChange={(e) => setPropertyFormData({ ...propertyFormData, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                      ></textarea>
                    </div>

                    {/* Original Property Photographs Manager */}
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-emerald-600" />
                          <label className="font-bold text-stone-900 text-xs sm:text-sm">
                            Original Property Photographs
                          </label>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                          Authentic Media
                        </span>
                      </div>

                      <p className="text-[11px] text-stone-500">
                        Upload or specify original photos taken on-site for this property. Original photographs automatically display on the website without any AI representative labels.
                      </p>

                      {/* Cover Photo Field */}
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Cover Photo (Main Display)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={propertyFormData.coverImage || ''}
                            onChange={(e) => setPropertyFormData({ ...propertyFormData, coverImage: e.target.value })}
                            placeholder="/images/darbhanga/cover.jpg or image URL"
                            className="flex-grow px-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white"
                          />
                          <label className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold cursor-pointer shrink-0 flex items-center gap-1.5 shadow-sm">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    if (reader.result) {
                                      setPropertyFormData({
                                        ...propertyFormData,
                                        coverImage: reader.result as string,
                                        images: [reader.result as string, ...(propertyFormData.images || []).filter(img => img !== reader.result)]
                                      });
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Gallery Images List */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[11px] font-bold text-stone-700">
                            Gallery Images ({propertyFormData.images?.length || 0})
                          </label>
                          <label className="text-[11px] text-amber-700 hover:text-amber-800 font-bold cursor-pointer flex items-center gap-1">
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    if (reader.result) {
                                      const current = propertyFormData.images || [];
                                      setPropertyFormData({
                                        ...propertyFormData,
                                        images: [...current, reader.result as string]
                                      });
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>

                        {/* Thumbnails preview */}
                        {propertyFormData.images && propertyFormData.images.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                            {propertyFormData.images.map((img, idx) => (
                              <div key={idx} className="relative group rounded-xl overflow-hidden border border-stone-200 aspect-video bg-stone-900">
                                <img
                                  src={img}
                                  alt={`preview ${idx}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/images/placeholder_property.svg';
                                  }}
                                />
                                {propertyFormData.coverImage === img && (
                                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-stone-950 text-[9px] font-extrabold shadow">
                                    Cover
                                  </span>
                                )}
                                <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 p-1">
                                  {propertyFormData.coverImage !== img && (
                                    <button
                                      type="button"
                                      onClick={() => setPropertyFormData({ ...propertyFormData, coverImage: img })}
                                      className="p-1 rounded bg-amber-500 text-stone-950 text-[10px] font-bold"
                                      title="Set as Cover"
                                    >
                                      Cover
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const filtered = (propertyFormData.images || []).filter((_, i) => i !== idx);
                                      setPropertyFormData({
                                        ...propertyFormData,
                                        images: filtered,
                                        coverImage: propertyFormData.coverImage === img ? (filtered[0] || '') : propertyFormData.coverImage
                                      });
                                    }}
                                    className="p-1 rounded bg-rose-600 text-white"
                                    title="Remove"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProperty(null);
                          setIsCreatingNew(false);
                        }}
                        className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold text-xs"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Property</span>
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: SITE VISITS MANAGEMENT */}
        {activeTab === 'siteVisits' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  Site Visit Bookings ({siteVisits.length})
                </h2>
                <p className="text-xs text-stone-500">
                  Scheduled on-site inspections requested by customers.
                </p>
              </div>
              <button
                onClick={fetchAllAdminData}
                className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center gap-1 text-xs font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {siteVisits.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm">
                <CalendarCheck className="w-12 h-12 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-stone-700">No site visit bookings yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold text-xs uppercase">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Preferred Date / Time</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Quick Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {siteVisits.map((visit) => (
                      <tr key={visit.id} className="hover:bg-stone-50/60">
                        <td className="p-4">
                          <div className="font-bold text-stone-900">{visit.name}</div>
                          <div className="text-xs text-stone-500 font-medium">+91 {visit.phone}</div>
                          {visit.plotRequirement && (
                            <div className="text-[11px] text-amber-800 mt-0.5">Req: {visit.plotRequirement}</div>
                          )}
                        </td>

                        <td className="p-4 font-semibold text-stone-800">
                          {visit.location}
                        </td>

                        <td className="p-4">
                          <div className="font-bold text-stone-900">{visit.date}</div>
                          <div className="text-xs text-stone-500">{visit.preferredTime}</div>
                        </td>

                        <td className="p-4">
                          <select
                            value={visit.status}
                            onChange={(e) => handleUpdateVisitStatus(visit.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              visit.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                              visit.status === 'Confirmed' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                              visit.status === 'Cancelled' ? 'bg-rose-50 text-rose-800 border-rose-200' :
                              'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="p-4 text-right space-x-2">
                          <a
                            href={`https://wa.me/91${visit.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${visit.name}, I am Satya Yadav regarding your scheduled site visit for ${visit.location}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex p-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          <a
                            href={`tel:+91${visit.phone.replace(/\D/g, '')}`}
                            className="inline-flex p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold"
                            title="Call Customer"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CONTACT ENQUIRIES */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  Website Inquiries ({enquiries.length})
                </h2>
                <p className="text-xs text-stone-500">
                  General and location messages submitted through the website.
                </p>
              </div>
              <button
                onClick={fetchAllAdminData}
                className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 flex items-center gap-1 text-xs font-semibold"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {enquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm">
                <Mail className="w-12 h-12 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-stone-700">No contact enquiries received yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold text-xs uppercase">
                      <th className="p-4">Customer</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Message</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {enquiries.map((enq) => (
                      <tr key={enq.id} className="hover:bg-stone-50/60">
                        <td className="p-4">
                          <div className="font-bold text-stone-900">{enq.name}</div>
                          <div className="text-xs text-stone-500 font-medium">+91 {enq.phone}</div>
                        </td>

                        <td className="p-4 font-semibold text-stone-800">
                          {enq.location}
                        </td>

                        <td className="p-4 text-xs text-stone-600 max-w-xs">
                          {enq.message || '—'}
                        </td>

                        <td className="p-4">
                          <select
                            value={enq.status}
                            onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                              enq.status === 'Closed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                              enq.status === 'Contacted' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                              'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </td>

                        <td className="p-4 text-right space-x-2">
                          <a
                            href={`https://wa.me/91${enq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${enq.name}, I am Satya Yadav regarding your plot inquiry for ${enq.location}.`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex p-2 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>

                          <a
                            href={`tel:+91${enq.phone.replace(/\D/g, '')}`}
                            className="inline-flex p-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SITE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Site & Consultant Settings
              </h2>
              <p className="text-xs text-stone-500">
                Update business phone, WhatsApp number, consultant name, and headline across the entire website.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs sm:text-sm">
              {saveStatus && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
                  {saveStatus}
                </div>
              )}

              <div>
                <label className="block font-bold text-stone-800 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={settingsForm.brandName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Owner / Consultant Name</label>
                  <input
                    type="text"
                    value={settingsForm.ownerName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">Domain</label>
                  <input
                    type="text"
                    value={settingsForm.domain}
                    onChange={(e) => setSettingsForm({ ...settingsForm, domain: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Main Hindi Headline</label>
                <textarea
                  rows={2}
                  value={settingsForm.hindiHeadline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hindiHeadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white font-medium"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">English Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-sm flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: TESTIMONIALS MANAGER */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  Customer Reviews & Testimonials
                </h2>
                <p className="text-xs text-stone-500">
                  Add genuine client feedback once registry and transactions are completed.
                </p>
              </div>

              <button
                onClick={() => setShowAddTestimonial(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Genuine Review</span>
              </button>
            </div>

            {/* Add Testimonial Form Modal */}
            {showAddTestimonial && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md">
                <h3 className="font-bold text-stone-900 text-base mb-4">Add Verified Customer Testimonial</h3>
                <form onSubmit={handleCreateTestimonial} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">Customer Name</label>
                      <input
                        type="text"
                        required
                        value={newTestimonial.customerName}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, customerName: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-800 mb-1">Location / Plot Bought</label>
                      <input
                        type="text"
                        required
                        value={newTestimonial.location}
                        onChange={(e) => setNewTestimonial({ ...newTestimonial, location: e.target.value })}
                        placeholder="e.g. Darbhanga Plot Owner"
                        className="w-full px-3 py-2 rounded-xl border border-stone-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Testimonial Text</label>
                    <textarea
                      rows={3}
                      required
                      value={newTestimonial.review}
                      onChange={(e) => setNewTestimonial({ ...newTestimonial, review: e.target.value })}
                      placeholder="Enter verified customer review..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    ></textarea>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs"
                    >
                      Publish Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddTestimonial(false)}
                      className="px-4 py-2 rounded-xl bg-stone-100 text-stone-600 font-semibold text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {testimonials.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-stone-200">
                <p className="text-sm font-semibold text-stone-600">
                  No testimonials added yet. The public website will honestly show "Customer reviews will be added here soon." until you add verified reviews here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-bold text-stone-900">{t.customerName}</div>
                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="text-rose-600 p-1 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-xs text-stone-500 mb-2">{t.location} • {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN') : 'Recent'}</div>
                      <p className="text-xs text-stone-700 italic">"{t.review}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};
