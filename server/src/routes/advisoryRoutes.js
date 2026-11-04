import express from 'express';
import { getAdvisory } from '../controllers/advisoryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/:analysisId', getAdvisory);

export default router;
