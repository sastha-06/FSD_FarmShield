import { encodeDigipin, decodeDigipin, isValidDigipin } from './server/src/services/digipin.js';

const lat = 28.622788;
const lon = 77.213033;
const digipin = encodeDigipin(lat, lon);
console.log('Encoded DIGIPIN:', digipin);
console.log('Valid:', isValidDigipin(digipin));

const decoded = decodeDigipin(digipin);
console.log('Decoded coordinates:', decoded.latitude, decoded.longitude);
console.log('Delta lat:', Math.abs(lat - decoded.latitude));
console.log('Delta lon:', Math.abs(lon - decoded.longitude));
