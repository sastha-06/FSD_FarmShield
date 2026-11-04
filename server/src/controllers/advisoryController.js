import { findAdvisoryByAnalysisId, findAnalysisById, findFieldById } from '../services/dataStore.js';

export const getAdvisory = async (req, res) => {
  try {
    const advisory = await findAdvisoryByAnalysisId(req.params.analysisId);
    if (!advisory) {
      return res.status(404).json({
        success: false,
        message: 'Context-aware advisory not found for the requested analysis.',
      });
    }

    const analysis = await findAnalysisById(advisory.analysisId, req.farmer._id);
    if (!analysis) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this advisory report.',
      });
    }

    const field = await findFieldById(advisory.fieldId, req.farmer._id);

    return res.json({
      success: true,
      advisory,
      analysis,
      field,
    });
  } catch (error) {
    console.error('Error fetching advisory:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve agricultural advisory.',
    });
  }
};
