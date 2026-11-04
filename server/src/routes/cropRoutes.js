import express from 'express';
import {
  recommendCrops,
  getFieldCropDetails,
  estimateProfitability,
} from '../controllers/cropController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/recommend', recommendCrops);
router.post('/profitability', estimateProfitability);
router.get('/:fieldId', getFieldCropDetails);

export default router;
