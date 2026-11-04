import express from 'express';
import {
  getFields,
  getField,
  addField,
  editField,
  removeField,
} from '../controllers/fieldController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All field routes require authentication

router.route('/')
  .get(getFields)
  .post(addField);

router.route('/:id')
  .get(getField)
  .put(editField)
  .delete(removeField);

export default router;
