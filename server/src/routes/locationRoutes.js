import express from 'express';
import {
  resolveDigipin,
  encodeToDigipin,
  reverseGeocode,
  searchPlaces,
} from '../controllers/locationController.js';

const router = express.Router();

router.post('/digipin/resolve', resolveDigipin);
router.post('/digipin/encode', encodeToDigipin);
router.get('/reverse-geocode', reverseGeocode);
router.get('/search', searchPlaces);

export default router;
