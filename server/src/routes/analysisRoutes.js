import express from 'express';
import {
  predictAndAnalyze,
  getAnalysisHistory,
  getAnalysisDetails,
} from '../controllers/analysisController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/predict', upload.single('image'), predictAndAnalyze);
router.get('/history', getAnalysisHistory);
router.get('/:id', getAnalysisDetails);

export default router;
