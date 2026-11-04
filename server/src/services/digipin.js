/**
 * Official India DIGIPIN Implementation for FarmShield Backend
 * India Post & IIT Hyderabad Specification
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

export const isValidDigipin = (input) => {
  if (!input || typeof input !== 'string') return false;
  const clean = input.replace(/[\s-]/g, '').toUpperCase();
  if (clean.length !== 10) return false;
  return clean.split('').every((ch) => DIGIPIN_ALPHABET.includes(ch));
};

export const formatDigipin = (digipin) => {
  if (!digipin) return '';
  const clean = digipin.replace(/[\s-]/g, '').toUpperCase();
  if (clean.length !== 10) return clean;
  return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6, 10)}`;
};

export const encodeDigipin = (lat, lon, formatted = true) => {
  const latitude = Number(lat);
  const longitude = Number(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Invalid coordinates.');
  }

  if (
    latitude < DIGIPIN_BOUNDS.minLat ||
    latitude > DIGIPIN_BOUNDS.maxLat ||
    longitude < DIGIPIN_BOUNDS.minLon ||
    longitude > DIGIPIN_BOUNDS.maxLon
  ) {
    throw new Error(
      `Coordinates (${latitude}, ${longitude}) outside DIGIPIN India bounds (Lat: 2.5°-38.5°N, Lon: 63.5°-99.5°E)`
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

    let row = 3 - Math.floor((latitude - minLat) / latDiv);
    let col = Math.floor((longitude - minLon) / lonDiv);

    row = Math.max(0, Math.min(3, row));
    col = Math.max(0, Math.min(3, col));

    digipinRaw += DIGIPIN_GRID[row][col];

    maxLat = minLat + latDiv * (4 - row);
    minLat = minLat + latDiv * (3 - row);
    minLon = minLon + lonDiv * col;
    maxLon = minLon + lonDiv;
  }

  return formatted ? formatDigipin(digipinRaw) : digipinRaw;
};

export const decodeDigipin = (digipin) => {
  if (!isValidDigipin(digipin)) {
    throw new Error('Invalid 10-character DIGIPIN code format.');
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
      throw new Error(`Symbol '${char}' is not part of the official DIGIPIN alphabet.`);
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
