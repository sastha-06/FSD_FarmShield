/**
 * FarmShield Weather Intelligence Service
 * Powered by Open-Meteo APIs (Free, Open-Source, Keyless Meteorological Service)
 * 
 * Provides:
 * 1. Current hyper-local weather
 * 2. 7-day agricultural forecast (max/min temp, precipitation sum, probability, solar radiation)
 * 3. Soil moisture & surface temperature estimates
 * 4. Regional historical climate normal baselines
 * 5. In-memory caching (15-min TTL) to prevent rate limits
 */

// In-memory weather cache: key -> { timestamp, data }
const weatherCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// WMO Weather Interpretation Codes (WW)
const WMO_CODE_MAP = {
  0: { label: 'Clear sky', icon: '☀️', condition: 'Clear' },
  1: { label: 'Mainly clear', icon: '🌤️', condition: 'Mostly Sunny' },
  2: { label: 'Partly cloudy', icon: '⛅', condition: 'Partly Cloudy' },
  3: { label: 'Overcast', icon: '☁️', condition: 'Overcast' },
  45: { label: 'Foggy', icon: '🌫️', condition: 'Fog' },
  48: { label: 'Depositing rime fog', icon: '🌫️', condition: 'Fog' },
  51: { label: 'Light drizzle', icon: '🌦️', condition: 'Drizzle' },
  53: { label: 'Moderate drizzle', icon: '🌧️', condition: 'Drizzle' },
  55: { label: 'Dense drizzle', icon: '🌧️', condition: 'Drizzle' },
  61: { label: 'Slight rain', icon: '🌦️', condition: 'Light Rain' },
  63: { label: 'Moderate rain', icon: '🌧️', condition: 'Moderate Rain' },
  65: { label: 'Heavy rain', icon: '⛈️', condition: 'Heavy Rain' },
  71: { label: 'Slight snow', icon: '🌨️', condition: 'Snow' },
  73: { label: 'Moderate snow', icon: '🌨️', condition: 'Snow' },
  75: { label: 'Heavy snow', icon: '❄️', condition: 'Heavy Snow' },
  80: { label: 'Slight rain showers', icon: '🌦️', condition: 'Showers' },
  81: { label: 'Moderate rain showers', icon: '🌧️', condition: 'Showers' },
  82: { label: 'Violent rain showers', icon: '⛈️', condition: 'Violent Showers' },
  95: { label: 'Thunderstorm', icon: '⛈️', condition: 'Thunderstorm' },
  96: { label: 'Thunderstorm with slight hail', icon: '⛈️', condition: 'Thunderstorm with Hail' },
  99: { label: 'Thunderstorm with heavy hail', icon: '⛈️', condition: 'Severe Thunderstorm' },
};

/**
 * Determine agro-climatic zone and historical climate normal based on latitude/longitude in India
 */
export const getRegionalClimateBaseline = (lat, lon, district = '') => {
  if (lat === null || lon === null || isNaN(lat) || isNaN(lon)) {
    return {
      agroClimaticZone: 'Peninsular / South India Zone',
      normalMonthlyRainfallMm: 85,
      normalAvgTempC: 28,
      climateDescription: 'Tropical semi-arid with seasonal monsoon influence.',
    };
  }

  const numLat = Number(lat);
  const numLon = Number(lon);

  // Tamil Nadu & Southern Peninsula (Lat 8.0 - 13.5, Lon 76.0 - 80.5)
  if (numLat >= 8.0 && numLat <= 13.5 && numLon >= 76.0 && numLon <= 80.5) {
    if (numLon >= 79.0) {
      return {
        agroClimaticZone: 'East Coast Plains & Hills (Cauvery Delta & Coastal TN)',
        normalMonthlyRainfallMm: 110,
        normalAvgTempC: 29,
        climateDescription: 'Coastal sub-humid with bimodal rainfall (prominent Northeast Monsoon during Oct-Dec).',
      };
    } else {
      return {
        agroClimaticZone: 'Southern Plateau & Hills (Western / Inland Tamil Nadu)',
        normalMonthlyRainfallMm: 70,
        normalAvgTempC: 27,
        climateDescription: 'Semi-arid tropical plateau with moderate summer showers and winter dry spell.',
      };
    }
  }

  // Northern Plains (Lat 24 - 32, Lon 74 - 88)
  if (numLat > 24.0 && numLat <= 32.0 && numLon >= 74.0 && numLon <= 88.0) {
    return {
      agroClimaticZone: 'Indo-Gangetic Plain Zone (Northern Plains)',
      normalMonthlyRainfallMm: 65,
      normalAvgTempC: 25,
      climateDescription: 'Sub-tropical continental with distinct hot summers and cool winters suitable for Rabi wheat.',
    };
  }

  // Central India / Deccan Plateau (Lat 14 - 24, Lon 73 - 82)
  if (numLat >= 14.0 && numLat <= 24.0 && numLon >= 73.0 && numLon <= 82.0) {
    return {
      agroClimaticZone: 'Central Plateau & Hills (Deccan / Black Soil Tract)',
      normalMonthlyRainfallMm: 90,
      normalAvgTempC: 28,
      climateDescription: 'Semi-arid tropical with peak rainfall during Southwest Monsoon (June-September).',
    };
  }

  // Default Pan-India Regional Baseline
  return {
    agroClimaticZone: 'Tropical / Subtropical Agricultural Zone',
    normalMonthlyRainfallMm: 80,
    normalAvgTempC: 27,
    climateDescription: 'Monsoon-influenced agricultural climate with seasonal precipitation variations.',
  };
};

/**
 * Fetch real weather data, 7-day forecast, and climate indicators from Open-Meteo API
 */
export const getLiveWeather = async (locationQuery, lat = null, lon = null) => {
  let latitude = lat !== null && lat !== undefined && lat !== '' ? Number(lat) : null;
  let longitude = lon !== null && lon !== undefined && lon !== '' ? Number(lon) : null;
  let locationLabel = locationQuery || 'Field Plot Location';

  // Check cache first
  const cacheKey = (latitude !== null && longitude !== null)
    ? `${latitude.toFixed(3)}_${longitude.toFixed(3)}`
    : `loc_${(locationQuery || '').toLowerCase().trim()}`;

  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return { ...cached.data, isCached: true };
  }

  try {
    // 1. Geocode if coordinates not directly available
    if (latitude === null || longitude === null || isNaN(latitude) || isNaN(longitude)) {
      if (!locationQuery || typeof locationQuery !== 'string' || !locationQuery.trim()) {
        return {
          isAvailable: false,
          reason: 'No location coordinates or district name provided.',
          disclaimer: 'Weather information is retrieved for your field location using weather forecast data.',
        };
      }

      const cleanQuery = locationQuery.split(',')[0].trim();
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        cleanQuery
      )}&count=1&language=en&format=json`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const geoRes = await fetch(geoUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!geoRes.ok) {
        return {
          isAvailable: false,
          reason: 'Geocoding service temporarily unavailable.',
          disclaimer: 'Weather information is retrieved for your field location using weather forecast data.',
        };
      }

      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        return {
          isAvailable: false,
          reason: `Location "${cleanQuery}" not found in meteorological registry.`,
          disclaimer: 'Weather information is retrieved for your field location using weather forecast data.',
        };
      }

      const firstHit = geoData.results[0];
      latitude = Number(firstHit.latitude);
      longitude = Number(firstHit.longitude);
      locationLabel = `${firstHit.name}${firstHit.admin1 ? `, ${firstHit.admin1}` : ''}, ${firstHit.country || 'India'}`;
    }

    // 2. Query Open-Meteo Forecast API with Current + 7-Day Daily Forecast + Hourly Soil Moisture
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(4)}&longitude=${longitude.toFixed(4)}` +
      `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,shortwave_radiation_sum` +
      `&hourly=soil_temperature_0cm,soil_moisture_0_to_1cm` +
      `&timezone=auto&forecast_days=7`;

    const weatherController = new AbortController();
    const weatherTimeout = setTimeout(() => weatherController.abort(), 4500);

    const weatherRes = await fetch(weatherUrl, { signal: weatherController.signal });
    clearTimeout(weatherTimeout);

    if (!weatherRes.ok) {
      return {
        isAvailable: false,
        reason: 'Open-Meteo forecast service returned a status error.',
        disclaimer: 'Weather information is retrieved for your field location using weather forecast data.',
      };
    }

    const weatherData = await weatherRes.json();
    const current = weatherData.current;

    if (!current) {
      return {
        isAvailable: false,
        reason: 'Meteorological parameters could not be retrieved from the response.',
        disclaimer: 'Weather information is retrieved for your field location using weather forecast data.',
      };
    }

    // Parse Current Weather
    const codeInfo = WMO_CODE_MAP[current.weather_code] || {
      label: 'Partly cloudy',
      icon: '⛅',
      condition: 'Partly Cloudy',
    };

    // Parse 7-Day Forecast
    const daily = weatherData.daily;
    const forecastDays = [];
    if (daily && daily.time) {
      for (let i = 0; i < daily.time.length; i++) {
        forecastDays.push({
          date: daily.time[i],
          maxTemp: Math.round(daily.temperature_2m_max?.[i] ?? 0),
          minTemp: Math.round(daily.temperature_2m_min?.[i] ?? 0),
          precipitationSumMm: Number((daily.precipitation_sum?.[i] ?? 0).toFixed(1)),
          precipProbabilityMax: daily.precipitation_probability_max?.[i] ?? 0,
          maxWindSpeedKmh: Math.round(daily.wind_speed_10m_max?.[i] ?? 0),
          solarRadiationMjm2: daily.shortwave_radiation_sum?.[i]
            ? Number(daily.shortwave_radiation_sum[i].toFixed(1))
            : null,
        });
      }
    }

    // Parse Estimated Soil Moisture (Surface 0-1cm and 0cm temperature if available)
    let soilMoistureEstimate = null;
    if (weatherData.hourly && weatherData.hourly.soil_moisture_0_to_1cm) {
      const recentMoistures = weatherData.hourly.soil_moisture_0_to_1cm.filter((v) => v !== null && v !== undefined);
      if (recentMoistures.length > 0) {
        // Average over first 24h
        const slice24 = recentMoistures.slice(0, 24);
        const avgMoisture = slice24.reduce((sum, v) => sum + v, 0) / slice24.length;
        const recentTemp = (weatherData.hourly.soil_temperature_0cm || []).slice(0, 24);
        const avgSoilTemp = recentTemp.length > 0
          ? Math.round(recentTemp.reduce((sum, v) => sum + v, 0) / recentTemp.length)
          : null;

        soilMoistureEstimate = {
          volumetricMoistureM3M3: Number(avgMoisture.toFixed(3)),
          percentage: Math.min(100, Math.round(avgMoisture * 100)),
          soilTempSurfaceC: avgSoilTemp,
          category: avgMoisture < 0.15 ? 'Dry' : avgMoisture < 0.30 ? 'Adequate' : 'Saturated / Wet',
          description: 'Calculated from Open-Meteo numerical land-surface models (ERA5-Land reanalysis).',
        };
      }
    }

    // Regional Climate Baseline
    const climateBaseline = getRegionalClimateBaseline(latitude, longitude, locationLabel);

    const result = {
      isAvailable: true,
      locationName: locationLabel,
      coordinates: {
        latitude: Number(latitude.toFixed(5)),
        longitude: Number(longitude.toFixed(5)),
      },
      current: {
        temperature: Math.round(current.temperature_2m),
        humidity: Math.round(current.relative_humidity_2m),
        rainfall: Number(current.precipitation.toFixed(1)),
        windSpeed: Math.round(current.wind_speed_10m),
        weatherCode: current.weather_code,
        weatherCondition: codeInfo.label,
        conditionCategory: codeInfo.condition,
        icon: codeInfo.icon,
      },
      // Convenience aliases for backward compatibility with existing analysis & advisory services
      temperature: Math.round(current.temperature_2m),
      humidity: Math.round(current.relative_humidity_2m),
      rainfall: Number(current.precipitation.toFixed(1)),
      windSpeed: Math.round(current.wind_speed_10m),
      weatherCondition: codeInfo.label,

      forecast: forecastDays,
      soilMoistureEstimate,
      climateBaseline,

      source: 'Open-Meteo Meteorological Service (Forecast & ERA5-Land Reanalysis)',
      lastUpdated: new Date().toISOString(),
      disclaimer: 'Weather information is retrieved for your field location using weather forecast data.',
      isPhysicalSensor: false,
    };

    // Save to in-memory cache
    weatherCache.set(cacheKey, { timestamp: Date.now(), data: result });
    return result;
  } catch (error) {
    // Graceful fallback without crashing
    const climateBaseline = getRegionalClimateBaseline(latitude, longitude, locationLabel);
    return {
      isAvailable: false,
      reason: 'Weather service is temporarily unavailable or network is offline.',
      fallbackClimate: climateBaseline,
      disclaimer: 'Weather data is temporarily unavailable. Recommendations are based only on the available field and agricultural information.',
      isPhysicalSensor: false,
    };
  }
};
