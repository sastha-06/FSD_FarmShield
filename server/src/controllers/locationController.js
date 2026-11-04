import {
  encodeDigipin,
  decodeDigipin,
  isValidDigipin,
  formatDigipin,
} from '../services/digipin.js';

/**
 * Reverse Geocode coordinates to address components using OpenStreetMap Nominatim
 */
export const fetchReverseGeocode = async (lat, lon) => {
  const latitude = Number(lat);
  const longitude = Number(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    return { success: false, message: 'Invalid coordinates' };
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'FarmShield-AgriTech/1.0 (India Agricultural Decision Support)',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { success: false, message: 'Reverse geocode service unreachable' };
    }

    const data = await res.json();
    const addr = data.address || {};

    const village =
      addr.village ||
      addr.suburb ||
      addr.hamlet ||
      addr.neighbourhood ||
      addr.town ||
      addr.city ||
      addr.county ||
      '';

    const district =
      addr.state_district ||
      addr.district ||
      addr.county ||
      addr.city ||
      '';

    const state = addr.state || '';
    const pincode = addr.postcode || '';

    let digipin = '';
    try {
      digipin = encodeDigipin(latitude, longitude, true);
    } catch {
      // outside Indian bounds
    }

    return {
      success: true,
      village,
      district,
      state,
      pincode,
      displayName: data.display_name || '',
      latitude,
      longitude,
      digipin,
    };
  } catch (err) {
    return {
      success: false,
      message: 'Network error retrieving reverse geocode data',
    };
  }
};

/**
 * Resolve DIGIPIN to geographic coordinates and address
 */
export const resolveDigipin = async (req, res) => {
  try {
    const { digipin } = req.body;

    if (!digipin || !isValidDigipin(digipin)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid DIGIPIN. Must be a 10-character code using approved symbols: 2-9, C, F, J, K, L, M, P, T.',
      });
    }

    const decoded = decodeDigipin(digipin);

    // Reverse geocode to find village/district
    const geo = await fetchReverseGeocode(decoded.latitude, decoded.longitude);

    return res.json({
      success: true,
      digipin: decoded.formatted,
      latitude: decoded.latitude,
      longitude: decoded.longitude,
      bounds: decoded.bounds,
      precision: decoded.precisionMeters,
      village: geo.village || '',
      district: geo.district || '',
      state: geo.state || '',
      pincode: geo.pincode || '',
      displayName: geo.displayName || '',
      source: 'digipin',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to resolve DIGIPIN code.',
    });
  }
};

/**
 * Encode coordinates into an official DIGIPIN
 */
export const encodeToDigipin = (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and Longitude are required.',
      });
    }

    const digipin = encodeDigipin(Number(latitude), Number(longitude), true);

    return res.json({
      success: true,
      digipin,
      raw: digipin.replace(/-/g, ''),
      latitude: Number(latitude),
      longitude: Number(longitude),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to encode coordinates into DIGIPIN.',
    });
  }
};

/**
 * Reverse geocode endpoint
 */
export const reverseGeocode = async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({
      success: false,
      message: 'Both lat and lon parameters are required.',
    });
  }

  const result = await fetchReverseGeocode(lat, lon);
  return res.json(result);
};

/**
 * Search places within India using Nominatim
 */
export const searchPlaces = async (req, res) => {
  const { query } = req.query;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.json({ success: true, results: [] });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query.trim()
    )}&countrycodes=in&limit=5&addressdetails=1`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'FarmShield-AgriTech/1.0 (India Agricultural Decision Support)',
      },
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      return res.json({ success: true, results: [] });
    }

    const data = await resp.json();
    const results = data.map((item) => {
      const addr = item.address || {};
      const lat = Number(item.lat);
      const lon = Number(item.lon);

      let digipin = '';
      try {
        digipin = encodeDigipin(lat, lon, true);
      } catch {
        // Outside DIGIPIN bounds
      }

      return {
        displayName: item.display_name,
        latitude: lat,
        longitude: lon,
        digipin,
        village:
          addr.village ||
          addr.suburb ||
          addr.hamlet ||
          addr.neighbourhood ||
          addr.town ||
          addr.city ||
          '',
        district: addr.state_district || addr.district || addr.county || '',
        state: addr.state || '',
        pincode: addr.postcode || '',
      };
    });

    return res.json({ success: true, results });
  } catch (err) {
    return res.json({ success: true, results: [] });
  }
};
