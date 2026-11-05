import express from 'express';
import { askAgronomicAssistant } from '../services/geminiService.js';

const router = express.Router();

/**
 * POST /api/chat
 * Multilingual AI Agronomist Chatbot endpoint
 */
router.post('/', async (req, res) => {
  try {
    const { message, language = 'en', context = {} } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'A valid text query is required.',
      });
    }

    const result = await askAgronomicAssistant({
      message: message.trim(),
      language,
      context,
    });

    return res.json({
      success: true,
      reply: result.reply,
      source: result.source,
      model: result.model,
      notice: result.notice || null,
    });
  } catch (error) {
    console.error('[Chat API Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process agronomic consultation query.',
      error: error.message,
    });
  }
});

export default router;
