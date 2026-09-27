import React, { useState, useEffect, useRef } from 'react';
import {
  FiCalendar,
  FiTrendingUp,
  FiBarChart,
  FiClock,
  FiCheckCircle,
  FiMapPin,
  FiNavigation
} from 'react-icons/fi';
// import ReactMarkdown from "react-markdown";
import { Remark } from "react-remark";
//  import { FiTrendingUp } from "react-icons/fi";

const SmartCropPlanning = () => {
  const [form, setForm] = useState({
    state: '',
    district: '',
    season: 'kharif',
    soilType: 'Loamy',
    landArea: '',
    irrigationSource: 'Rainfed',
    budget: 'Medium',
    lastCrop: '',
    latitude: '',
    longitude: ''
  });
  const [cropRecommendations, setCropRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // Default: India center
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Initialize map
  useEffect(() => {
    const loadMap = async () => {
      try {
        // Dynamically import Leaflet
        const L = await import('leaflet');
        await import('leaflet/dist/leaflet.css');

        // Fix for default marker icon issue in Leaflet (if needed)
        if (L.Icon.Default.prototype._getIconUrl) {
          delete L.Icon.Default.prototype._getIconUrl;
        }
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        if (mapRef.current && !mapInstanceRef.current) {
          // Create map instance
          const map = L.map(mapRef.current).setView(mapCenter, 6);

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          // Add click handler to select location
          map.on('click', async (e) => {
            const { lat, lng } = e.latlng;
            setSelectedLocation({ lat, lng });
            setForm(prev => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }));

            // Remove existing marker
            if (markerRef.current) {
              map.removeLayer(markerRef.current);
            }

            // Add new marker
            const marker = L.marker([lat, lng], {
              icon: L.divIcon({
                className: 'custom-marker',
                html: '<div style="background-color: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })
            }).addTo(map);
            markerRef.current = marker;

            // Reverse geocode to get location details
            await reverseGeocode(lat, lng);
          });

          mapInstanceRef.current = map;
          setMapLoaded(true);
        }
      } catch (err) {
        console.error('Error loading map:', err);
        setError('Failed to load map. Please refresh the page.');
      }
    };

    loadMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Get user's current location
  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            setMapCenter([latitude, longitude]);
            setSelectedLocation({ lat: latitude, lng: longitude });
            setForm(prev => ({ ...prev, latitude: latitude.toString(), longitude: longitude.toString() }));

            // Update map view
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setView([latitude, longitude], 12);

              // Remove existing marker
              if (markerRef.current) {
                mapInstanceRef.current.removeLayer(markerRef.current);
              }

              // Add marker at current location
              const L = await import('leaflet');
              const marker = L.marker([latitude, longitude], {
                icon: L.divIcon({
                  className: 'custom-marker',
                  html: '<div style="background-color: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                  iconSize: [20, 20],
                  iconAnchor: [10, 10]
                })
              }).addTo(mapInstanceRef.current);
              markerRef.current = marker;
            }

            // Reverse geocode
            await reverseGeocode(latitude, longitude);
            setLoading(false);
          } catch (err) {
            console.error('Error setting location:', err);
            setError('Error setting location. Please try again.');
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to get your location. Please select on the map manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  // Reverse geocode coordinates to get state and district
  const reverseGeocode = async (lat, lng) => {
    try {
      // Using Nominatim (OpenStreetMap's geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'FarmerBuddy/1.0'
          }
        }
      );

      const data = await response.json();
      if (data && data.address) {
        const address = data.address;
        const state = address.state || address.region || '';
        const district = address.county || address.district || address.city || '';

        setForm(prev => ({
          ...prev,
          state: state,
          district: district
        }));
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      // Don't show error to user, just log it
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // New state for text report
  const [recommendationReport, setRecommendationReport] = useState('');

  const getSmartRecommendations = async () => {
    // Call our backend API
    const apiUrl = 'http://localhost:5000/api/smart-crop-planning';

    const payload = {
      state: form.state,
      district: form.district,
      season: form.season,
      soilType: form.soilType,
      landArea: form.landArea,
      irrigationSource: form.irrigationSource,
      budget: form.budget,
      lastCrop: form.lastCrop
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recommendations from server');
    }

    const result = await response.json();

    if (result.success && result.data) {
      return result.data.text;
    } else {
      throw new Error(result.error || 'Failed to analyze');
    }
  };

  const onSubmit = async () => {
    // Validate required fields
    if (!form.state || !form.district || !form.landArea) {
      setError('Please fill in all required fields (State, District, and Land Area)');
      return;
    }

    try {
      setError('');
      setLoading(true);
      setCropRecommendations([]);
      setRecommendationReport(''); // Reset report

      const report = await getSmartRecommendations();
      if (report) {
        setRecommendationReport(report);
      } else {
        setError('No recommendations received. Please try again with different inputs.');
      }
    } catch (e) {
      console.error('Error getting recommendations:', e);
      setError(e.message || 'Failed to get AI recommendations. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => { /* retained for compatibility or removal */ return ''; };
  const getProfitColor = (profit) => { return ''; };
  const getRiskColor = (risk) => { return ''; };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <div className="container mx-auto px-4 pb-8 pt-28">
        {/* Header with Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-12 bg-primary-900 shadow-xl">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=2000&auto=format&fit=crop"
              alt="Crop Planning"
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-800/80" />
          </div>

          <div className="relative z-10 p-8 md:p-16 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              AI-Powered Analysis
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Smart Crop Planning Assistant
            </h1>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Make data-driven decisions for your farm. We analyze soil health, weather patterns, and market trends to recommend the most profitable crops for you.
            </p>
          </div>
        </div>

        {/* Location Map Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
          {/* ... existing map code (omitted for brevity, assume logic remains if outside this replacement chunk or handled carefully) ... */}
          {/* For this specific edit, I am targeting the entire component logic replacement mainly for onSubmit and Results */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <FiMapPin className="text-primary-500" />
              Select Your Farm Location
            </h2>
            {/* ... rest of map UI ... */}
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-all duration-200 text-sm font-medium"
            >
              <FiNavigation className="w-4 h-4" />
              Use My Location
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Click on the map to select your farm location, or use the "Use My Location" button. This will automatically fill in your State and District.
          </p>
          <div className="relative">
            <div
              ref={mapRef}
              className="w-full h-96 rounded-xl border border-gray-300 dark:border-gray-600 z-0"
              style={{ minHeight: '400px' }}
            />
            {/* ... map loaders ... */}
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
                </div>
              </div>
            )}
            {selectedLocation && (
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Selected Location</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
          {/* Farm Details Form (Preserved) */}
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Enter Your Farm Details
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Please provide the following information that you know about your farm. All fields are required for accurate crop recommendations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ... Inputs ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                placeholder="e.g., Gujarat, Maharashtra, Punjab"
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {/* ... */}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                District <span className="text-red-500">*</span>
              </label>
              <input
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="e.g., Ahmedabad, Surat, Ludhiana"
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Season <span className="text-red-500">*</span>
              </label>
              <select
                name="season"
                value={form.season}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="kharif">Kharif (Monsoon - June to October)</option>
                <option value="rabi">Rabi (Winter - November to March)</option>
                <option value="zaid">Zaid (Summer - March to June)</option>
              </select>
            </div>
            {/* ... other inputs ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Soil Type <span className="text-red-500">*</span>
              </label>
              <select
                name="soilType"
                value={form.soilType}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Loamy">Loamy (Best for most crops)</option>
                <option value="Sandy">Sandy (Light, well-drained)</option>
                <option value="Clay">Clay (Heavy, retains water)</option>
                <option value="Black">Black (Rich in nutrients)</option>
                <option value="Red">Red (Common in South India)</option>
                <option value="Alluvial">Alluvial (River deposits)</option>
                <option value="Silt">Silt (Fine particles)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Land Area <span className="text-red-500">*</span>
              </label>
              <input
                name="landArea"
                value={form.landArea}
                onChange={handleChange}
                type="number"
                placeholder="e.g., 2 (in acres or hectares)"
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Irrigation Source <span className="text-red-500">*</span>
              </label>
              <select
                name="irrigationSource"
                value={form.irrigationSource}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Rainfed">Rainfed (Only rainfall)</option>
                <option value="Borewell">Borewell (Groundwater)</option>
                <option value="Canal">Canal (Government canal water)</option>
                <option value="River">River (River water)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Budget <span className="text-red-500">*</span>
              </label>
              <select
                name="budget"
                value={form.budget}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Low">Low (₹10,000 - ₹50,000 per acre)</option>
                <option value="Medium">Medium (₹50,000 - ₹1,00,000 per acre)</option>
                <option value="High">High (Above ₹1,00,000 per acre)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Season Crop (Optional)
              </label>
              <input
                name="lastCrop"
                value={form.lastCrop}
                onChange={handleChange}
                placeholder="e.g., Wheat, Rice, Cotton"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Helps with crop rotation planning</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onSubmit}
              disabled={loading || !form.state || !form.district || !form.landArea}
              className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <FiClock className="animate-spin" />
                  Analyzing farm data...
                </span>
              ) : (
                'Get AI Crop Recommendations'
              )}
            </button>
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations - Text Report */}
        {recommendationReport && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
              <FiTrendingUp className="mr-2 text-primary-500" />
              AI-Powered Crop Plan
            </h2>
            <div className="prose prose-green max-w-none dark:prose-invert leading-relaxed text-gray-700 dark:text-gray-300">
              <div className="reset-tw markdown-body">
                <Remark>{recommendationReport}</Remark>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SmartCropPlanning;
