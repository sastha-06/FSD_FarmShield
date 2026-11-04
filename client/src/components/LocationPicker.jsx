import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Search,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import {
  encodeDigipin,
  decodeDigipin,
  isValidDigipin,
  formatDigipin,
  DIGIPIN_BOUNDS,
} from '../services/digipin';
import api from '../services/api';
import Button from './Button';
import Badge from './Badge';

// Custom Farm Marker Icon for Leaflet
const createFarmIcon = (isGps = false) => {
  return L.divIcon({
    className: 'custom-farm-marker',
    html: `
      <div style="position: relative; width: 36px; height: 36px;">
        <div style="
          width: 36px;
          height: 36px;
          background: ${isGps ? '#205799' : '#174C35'};
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid #FFFFFF;
          box-shadow: 0 4px 12px rgba(23, 76, 53, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 16px; line-height: 1;">
            ${isGps ? '📍' : '🌱'}
          </span>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const LocationPicker = ({
  initialLocation = null,
  onLocationSelect,
  className = '',
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  // Active Tab: 'map' | 'digipin'
  const [activeTab, setActiveTab] = useState('map');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // DIGIPIN input state
  const [digipinInput, setDigipinInput] = useState(initialLocation?.digipin || '');
  const [digipinError, setDigipinError] = useState('');
  const [resolvingDigipin, setResolvingDigipin] = useState(false);

  // GPS state
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  // Reverse Geocoding state
  const [geocoding, setGeocoding] = useState(false);

  // Confirmed Location Data State
  const [confirmedLocation, setConfirmedLocation] = useState({
    digipin: initialLocation?.digipin || '',
    latitude: initialLocation?.latitude || null,
    longitude: initialLocation?.longitude || null,
    village: initialLocation?.village || '',
    district: initialLocation?.district || '',
    state: initialLocation?.state || '',
    pincode: initialLocation?.pincode || '',
    displayName: initialLocation?.displayName || initialLocation?.location || '',
    locationSource: initialLocation?.locationSource || 'manual',
  });

  const [copiedDigipin, setCopiedDigipin] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // already initialized

    // Default coordinates: Indian agricultural central zone or initial coordinates
    const defaultLat = initialLocation?.latitude || 19.7515;
    const defaultLng = initialLocation?.longitude || 75.7139;
    const defaultZoom = initialLocation?.latitude ? 14 : 5;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: defaultZoom,
      zoomControl: true,
    });

    // OpenStreetMap standard tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    // Place initial marker if coordinates provided
    if (initialLocation?.latitude && initialLocation?.longitude) {
      placeMarker(initialLocation.latitude, initialLocation.longitude, false);
    }

    // Map click handler to place marker
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      handleCoordinatesUpdate(lat, lng, 'map');
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Invalidate map size when tab changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 250);
    }
  }, [activeTab]);

  // Place or Move Marker helper
  const placeMarker = (lat, lng, isGps = false) => {
    if (!mapInstanceRef.current) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.setIcon(createFarmIcon(isGps));
    } else {
      const marker = L.marker([lat, lng], {
        icon: createFarmIcon(isGps),
        draggable: true,
        title: 'Farm Location (Drag to adjust)',
      }).addTo(mapInstanceRef.current);

      marker.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        handleCoordinatesUpdate(pos.lat, pos.lng, 'map');
      });

      markerRef.current = marker;
    }
  };

  // Perform Reverse Geocoding
  const reverseGeocode = async (lat, lng, source = 'map') => {
    try {
      setGeocoding(true);
      const res = await api.get(`/location/reverse-geocode?lat=${lat}&lon=${lng}`);
      if (res.data?.success) {
        const { village, district, state, pincode, displayName, digipin } = res.data;

        const updated = {
          digipin: digipin || confirmedLocation.digipin,
          latitude: Number(lat.toFixed(6)),
          longitude: Number(lng.toFixed(6)),
          village: village || confirmedLocation.village,
          district: district || confirmedLocation.district,
          state: state || confirmedLocation.state,
          pincode: pincode || confirmedLocation.pincode,
          displayName: displayName || confirmedLocation.displayName,
          locationSource: source,
        };

        setConfirmedLocation(updated);
        if (onLocationSelect) {
          onLocationSelect(updated);
        }
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
    } finally {
      setGeocoding(false);
    }
  };

  // Central Coordinator: When coordinates change via Map Click, Drag, GPS, or Search
  const handleCoordinatesUpdate = (lat, lng, source = 'map') => {
    const latitude = Number(lat);
    const longitude = Number(lng);

    placeMarker(latitude, longitude, source === 'gps');

    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([latitude, longitude]);
    }

    // 1. Calculate Official DIGIPIN if within India bounds
    let officialDigipin = '';
    try {
      officialDigipin = encodeDigipin(latitude, longitude, true);
      setDigipinInput(officialDigipin);
    } catch (err) {
      // outside bounds
    }

    // 2. Update state immediately
    const nextState = {
      ...confirmedLocation,
      latitude: Number(latitude.toFixed(6)),
      longitude: Number(longitude.toFixed(6)),
      digipin: officialDigipin || confirmedLocation.digipin,
      locationSource: source,
    };

    setConfirmedLocation(nextState);

    // 3. Reverse geocode address details
    reverseGeocode(latitude, longitude, source);
  };

  // ==========================================
  // GPS: "Use My Current Location"
  // ==========================================
  const handleUseCurrentLocation = () => {
    setGpsError('');
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLoading(false);
        const { latitude, longitude } = position.coords;

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16, { duration: 1.5 });
        }

        handleCoordinatesUpdate(latitude, longitude, 'gps');
      },
      (error) => {
        setGpsLoading(false);
        let msg = 'Failed to obtain current GPS location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow access in browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Current position unavailable. Please try searching or map selection.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please check your signal.';
        }
        setGpsError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // ==========================================
  // Search Village / District / Town
  // ==========================================
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearching(true);
      const res = await api.get(`/location/search?query=${encodeURIComponent(searchQuery.trim())}`);
      if (res.data?.success && res.data.results?.length > 0) {
        setSearchResults(res.data.results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectSearchResult = (result) => {
    setSearchResults([]);
    setSearchQuery(result.displayName);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([result.latitude, result.longitude], 15, { duration: 1.5 });
    }

    handleCoordinatesUpdate(result.latitude, result.longitude, 'search');
  };

  // ==========================================
  // DIGIPIN Input & Resolution
  // ==========================================
  const handleResolveDigipin = async (e) => {
    if (e) e.preventDefault();
    setDigipinError('');

    if (!digipinInput.trim()) {
      setDigipinError('Please enter a 10-character India DIGIPIN.');
      return;
    }

    if (!isValidDigipin(digipinInput)) {
      setDigipinError(
        'Invalid DIGIPIN format. A valid DIGIPIN consists of 10 characters using approved symbols (2-9, C, F, J, K, L, M, P, T).'
      );
      return;
    }

    try {
      setResolvingDigipin(true);
      // Decode using official algorithm directly
      const decoded = decodeDigipin(digipinInput);

      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([decoded.latitude, decoded.longitude], 17, { duration: 1.5 });
      }

      placeMarker(decoded.latitude, decoded.longitude, false);

      // Reverse geocode to extract village & district
      await reverseGeocode(decoded.latitude, decoded.longitude, 'digipin');
    } catch (err) {
      setDigipinError(err.message || 'Failed to resolve DIGIPIN.');
    } finally {
      setResolvingDigipin(false);
    }
  };

  const handleCopyDigipin = () => {
    if (!confirmedLocation.digipin) return;
    navigator.clipboard.writeText(confirmedLocation.digipin);
    setCopiedDigipin(true);
    setTimeout(() => setCopiedDigipin(false), 2000);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Mode Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-border-green pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-forest-green text-white shadow-sm'
                : 'text-deep-charcoal bg-soft-cream/60 hover:bg-soft-cream'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Interactive Map & Search</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('digipin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'digipin'
                ? 'bg-forest-green text-white shadow-sm'
                : 'text-deep-charcoal bg-soft-cream/60 hover:bg-soft-cream'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-fresh-green" />
            <span>Enter 10-char DIGIPIN</span>
          </button>
        </div>

        {/* GPS Quick Action */}
        <Button
          type="button"
          variant="sage"
          size="sm"
          onClick={handleUseCurrentLocation}
          loading={gpsLoading}
          icon={Navigation}
          className="text-xs"
        >
          Use My GPS Location
        </Button>
      </div>

      {gpsError && (
        <div className="p-2.5 rounded-xl bg-[#FDF0EE] border border-[#F5C7C3] text-error-red text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Tab 1: Interactive Map & Search Bar */}
      {activeTab === 'map' && (
        <div className="space-y-2">
          {/* Search bar */}
          <div className="relative">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-muted-green absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search village, town, district, taluka, or landmark..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border-green focus:border-forest-green bg-soft-cream/20"
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                loading={searching}
                className="text-xs px-3"
              >
                Search
              </Button>
            </form>

            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-border-green max-h-48 overflow-y-auto divide-y divide-border-green text-xs">
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full text-left p-2.5 hover:bg-soft-cream transition-colors flex items-start gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-forest-green mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-deep-charcoal truncate">{item.displayName}</p>
                      <p className="text-[10px] text-muted-green">
                        {item.village && `${item.village}, `}{item.district} ({item.state})
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <p className="text-[11px] text-muted-green flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-forest-green" />
            Click anywhere on the map or drag the green seedling marker to pin your exact field.
          </p>
        </div>
      )}

      {/* Tab 2: DIGIPIN Input Form */}
      {activeTab === 'digipin' && (
        <div className="p-3.5 rounded-2xl bg-light-sage/20 border border-light-sage/80 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-forest-green flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-fresh-green" /> Official India DIGIPIN Input
              </h5>
              <p className="text-[10px] text-muted-green">
                National Digital Addressing Grid developed by Department of Posts & IIT Hyderabad
              </p>
            </div>
            <Badge variant="default" size="sm">~3.8m Precision Grid</Badge>
          </div>

          <form onSubmit={handleResolveDigipin} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="e.g. 39J-49L-L8T4 or 39J49LL8T4"
                value={digipinInput}
                onChange={(e) => {
                  setDigipinInput(e.target.value.toUpperCase());
                  setDigipinError('');
                }}
                maxLength={14}
                className="w-full px-3.5 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-xl border border-border-green focus:border-forest-green bg-white shadow-sm"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={resolvingDigipin}
              className="text-xs"
            >
              Resolve on Map
            </Button>
          </form>

          {digipinError && (
            <p className="text-xs text-error-red flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {digipinError}
            </p>
          )}

          <p className="text-[10px] text-muted-green italic">
            Valid symbols: 2-9, C, F, J, K, L, M, P, T (Vowels and ambiguous letters excluded).
          </p>
        </div>
      )}

      {/* The Leaflet Map Canvas */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-border-green shadow-sm">
        <div
          ref={mapContainerRef}
          className="w-full h-64 sm:h-72 z-10"
          style={{ minHeight: '260px' }}
        />

        {geocoding && (
          <div className="absolute top-2 right-2 z-20 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-border-green text-[10px] text-forest-green font-semibold flex items-center gap-1.5 shadow-sm">
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Resolving address details...</span>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* LOCATION CONFIRMATION CARD (Requirement 4) */}
      {/* ============================================================== */}
      <div className="p-4 rounded-2xl bg-white border border-border-green shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-border-green pb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-fresh-green" />
            <h5 className="text-xs font-bold font-heading text-forest-green uppercase tracking-wide">
              Confirmed Farm Location Details
            </h5>
          </div>

          {confirmedLocation.locationSource && (
            <Badge
              variant={
                confirmedLocation.locationSource === 'digipin'
                  ? 'default'
                  : confirmedLocation.locationSource === 'gps'
                  ? 'info'
                  : 'success'
              }
              size="sm"
            >
              Source: {confirmedLocation.locationSource.toUpperCase()}
            </Badge>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* DIGIPIN */}
          <div className="col-span-2 sm:col-span-2 p-2.5 rounded-xl bg-light-sage/30 border border-light-sage flex items-center justify-between">
            <div>
              <span className="text-[10px] text-forest-green uppercase font-bold block">
                Official DIGIPIN
              </span>
              <span className="font-mono font-extrabold text-forest-green text-sm">
                {confirmedLocation.digipin || 'Not generated yet'}
              </span>
            </div>
            {confirmedLocation.digipin && (
              <button
                type="button"
                onClick={handleCopyDigipin}
                className="p-1.5 rounded-lg text-forest-green hover:bg-light-sage/60 transition-colors"
                title="Copy DIGIPIN"
              >
                {copiedDigipin ? <Check className="w-4 h-4 text-fresh-green" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Coordinates */}
          <div className="col-span-2 sm:col-span-2 p-2.5 rounded-xl bg-soft-cream border border-border-green">
            <span className="text-[10px] text-muted-green uppercase font-bold block">
              GPS Coordinates
            </span>
            <span className="font-semibold text-deep-charcoal text-xs">
              {confirmedLocation.latitude && confirmedLocation.longitude
                ? `${confirmedLocation.latitude}° N, ${confirmedLocation.longitude}° E`
                : 'Click map or use GPS to set'}
            </span>
          </div>

          {/* Village */}
          <div className="p-2 rounded-lg bg-soft-cream/50">
            <span className="text-[10px] text-muted-green block font-medium">Village / Locality</span>
            <span className="font-bold text-deep-charcoal truncate block">
              {confirmedLocation.village || 'Pending map pin'}
            </span>
          </div>

          {/* District */}
          <div className="p-2 rounded-lg bg-soft-cream/50">
            <span className="text-[10px] text-muted-green block font-medium">District</span>
            <span className="font-bold text-deep-charcoal truncate block">
              {confirmedLocation.district || 'Pending map pin'}
            </span>
          </div>

          {/* State */}
          <div className="p-2 rounded-lg bg-soft-cream/50">
            <span className="text-[10px] text-muted-green block font-medium">State</span>
            <span className="font-bold text-deep-charcoal truncate block">
              {confirmedLocation.state || 'India'}
            </span>
          </div>

          {/* PIN Code */}
          <div className="p-2 rounded-lg bg-soft-cream/50">
            <span className="text-[10px] text-muted-green block font-medium">Postal PIN Code</span>
            <span className="font-bold text-deep-charcoal truncate block">
              {confirmedLocation.pincode || '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPicker;
