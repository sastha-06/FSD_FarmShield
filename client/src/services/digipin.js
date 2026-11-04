/**
 * Official India DIGIPIN (Digital Postal Index Number) Implementation
 * Developed in accordance with India Post, Department of Posts, and IIT Hyderabad specifications.
 * 
 * Grid Bounding Box (covering Indian territory & maritime EEZ):
 *   Latitude: 2.5° N to 38.5° N
 *   Longitude: 63.5° E to 99.5° E
 * 
 * 16-Symbol Alphanumeric Set (excluding easily confused letters):
 *   2, 3, 4, 5, 6, 7, 8, 9, C, F, J, K, L, M, P, T
 */

export const DIGIPIN_GRID = [
  ['F', 'C', '9', '8'],
  ['J', '3', '2', '7'],
  ['K', '4', '5', '6'],
  ['L', 'M', 'P', 'T'],
];

export const DIGIPIN_BOUNDS = {
  minLat: 2.5,
  maxLat: 38.5,
  minLon: 63.5,
  maxLon: 99.5,
};

export const DIGIPIN_ALPHABET = [
  '2', '3', '4', '5', '6', '7', '8', '9',
  'C', 'F', 'J', 'K', 'L', 'M', 'P', 'T',
];

/**
 * Validate whether a string is a valid DIGIPIN format and contains only approved symbols
 */
export const isValidDigipin = (input) => {
  if (!input || typeof input !== 'string') return false;
  const clean = input.replace(/[\s-]/g, '').toUpperCase();
  if (clean.length !== 10) return false;
  return clean.split('').every((ch) => DIGIPIN_ALPHABET.includes(ch));
};

/**
 * Format a 10-character DIGIPIN string into official presentation format (e.g. 39J-49L-L8T4)
 */
export const formatDigipin = (digipin) => {
  if (!digipin) return '';
  const clean = digipin.replace(/[\s-]/g, '').toUpperCase();
  if (clean.length !== 10) return clean;
  return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 10)}`;
};

/**
 * Encode latitude and longitude into an official 10-character India DIGIPIN
 * @param {number} lat - Latitude in decimal degrees
 * @param {number} lon - Longitude in decimal degrees
 * @param {boolean} formatted - Whether to return with hyphens (e.g. 39J-49L-L8T4)
 * @returns {string} DIGIPIN
 */
export const encodeDigipin = (lat, lon, formatted = true) => {
  const latitude = Number(lat);
  const longitude = Number(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Invalid latitude or longitude coordinates provided.');
  }

  if (
    latitude < DIGIPIN_BOUNDS.minLat ||
    latitude > DIGIPIN_BOUNDS.maxLat ||
    longitude < DIGIPIN_BOUNDS.minLon ||
    longitude > DIGIPIN_BOUNDS.maxLon
  ) {
    throw new Error(
      `Coordinates (${latitude.toFixed(4)}, ${longitude.toFixed(4)}) fall outside the Indian DIGIPIN geographical bounding box (Lat: 2.5° to 38.5° N, Lon: 63.5° to 99.5° E).`
    );
  }

  let minLat = DIGIPIN_BOUNDS.minLat;
  let maxLat = DIGIPIN_BOUNDS.maxLat;
  let minLon = DIGIPIN_BOUNDS.minLon;
  let maxLon = DIGIPIN_BOUNDS.maxLon;

  let digipinRaw = '';

  for (let level = 1; level <= 10; level++) {
    const latDiv = (maxLat - minLat) / 4.0;
    const lonDiv = (maxLon - minLon) / 4.0;

    // Row calculation with north-to-south inverted index
    let row = 3 - Math.floor((latitude - minLat) / latDiv);
    let col = Math.floor((longitude - minLon) / lonDiv);

    // Boundary protection
    row = Math.max(0, Math.min(3, row));
    col = Math.max(0, Math.min(3, col));

    digipinRaw += DIGIPIN_GRID[row][col];

    // Narrow down bounding box for the next subdivision
    maxLat = minLat + latDiv * (4 - row);
    minLat = minLat + latDiv * (3 - row);
    minLon = minLon + lonDiv * col;
    maxLon = minLon + lonDiv;
  }

  return formatted ? formatDigipin(digipinRaw) : digipinRaw;
};

/**
 * Decode an official India DIGIPIN back into its center latitude and longitude coordinates
 * @param {string} digipin - 10-character DIGIPIN string (with or without hyphens)
 * @returns {Object} { latitude, longitude, bounds, formatted, raw }
 */
export const decodeDigipin = (digipin) => {
  if (!isValidDigipin(digipin)) {
    throw new Error(
      'Invalid DIGIPIN code. A valid DIGIPIN must contain exactly 10 characters using approved symbols: 2-9, C, F, J, K, L, M, P, T.'
    );
  }

  const clean = digipin.replace(/[\s-]/g, '').toUpperCase();

  let minLat = DIGIPIN_BOUNDS.minLat;
  let maxLat = DIGIPIN_BOUNDS.maxLat;
  let minLon = DIGIPIN_BOUNDS.minLon;
  let maxLon = DIGIPIN_BOUNDS.maxLon;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];

    let foundRow = -1;
    let foundCol = -1;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (DIGIPIN_GRID[r][c] === char) {
          foundRow = r;
          foundCol = c;
          break;
        }
      }
      if (foundRow !== -1) break;
    }

    if (foundRow === -1) {
      throw new Error(`Symbol '${char}' is not part of the official DIGIPIN alphanumeric grid.`);
    }

    const latDiv = (maxLat - minLat) / 4.0;
    const lonDiv = (maxLon - minLon) / 4.0;

    const newMaxLat = minLat + latDiv * (4 - foundRow);
    const newMinLat = minLat + latDiv * (3 - foundRow);
    const newMinLon = minLon + lonDiv * foundCol;
    const newMaxLon = minLon + lonDiv * (foundCol + 1);

    minLat = newMinLat;
    maxLat = newMaxLat;
    minLon = newMinLon;
    maxLon = newMaxLon;
  }

  const centerLat = Number(((minLat + maxLat) / 2.0).toFixed(6));
  const centerLon = Number(((minLon + maxLon) / 2.0).toFixed(6));

  return {
    latitude: centerLat,
    longitude: centerLon,
    formatted: formatDigipin(clean),
    raw: clean,
    bounds: {
      minLat: Number(minLat.toFixed(6)),
      maxLat: Number(maxLat.toFixed(6)),
      minLon: Number(minLon.toFixed(6)),
      maxLon: Number(maxLon.toFixed(6)),
    },
    precisionMeters: '~3.8m x 3.8m',
  };
};
