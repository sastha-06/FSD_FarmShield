import path from 'path';
import {
  findFieldById,
  createAnalysis,
  createAdvisory,
  findAnalysesByFarmerId,
  findAnalysisById,
  findAdvisoryByAnalysisId,
} from '../services/dataStore.js';
import { classifyCropImage } from '../services/aiService.js';
import { estimateGrowthStage } from '../services/cropRules.js';
import { getLiveWeather } from '../services/weatherService.js';
import { generateContextAwareAdvisory } from '../services/advisoryEngine.js';

export const predictAndAnalyze = async (req, res) => {
  try {
    const { fieldId } = req.body;

    if (!fieldId) {
      return res.status(400).json({
        success: false,
        message: 'Please select a registered field to associate with this crop analysis.',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a clear plant leaf or affected foliage image (JPG, JPEG, or PNG).',
      });
    }

    // 1. Verify field ownership
    const field = await findFieldById(fieldId, req.farmer._id);
    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Selected field was not found in your account.',
      });
    }

    const imagePath = req.file.path;
    const imageUrl = `/uploads/${req.file.filename}`;

    // 2. Run actual AI image classification model (Local ONNX DINOv2)
    const prediction = await classifyCropImage(imagePath, field.cropName);

    // Guard: Never save failed inference requests or unavailable service errors to the database
    if (prediction.predictionStatus === 'api_unavailable' || prediction.predictionStatus === 'error') {
      return res.status(503).json({
        success: false,
        status: 'unavailable',
        message: 'AI disease classification is temporarily unavailable. Please try again later.',
        error: prediction.conditionDescription,
      });
    }

    if (prediction.predictionStatus === 'unsupported_crop') {
      return res.status(400).json({
        success: false,
        status: 'unsupported_crop',
        message: prediction.conditionDescription,
        crop: field.cropName,
      });
    }

    // 3. Compute growth stage estimate if planted
    const growthStageInfo = field.isCropPlanted
      ? estimateGrowthStage(field.cropName, field.plantingDate)
      : null;

    // 4. Fetch live weather for field location or exact coordinates
    const weatherInfo = await getLiveWeather(
      field.district || field.location,
      field.latitude,
      field.longitude
    );

    // 5. Generate Context-Aware Agricultural Advisory (Standout Feature)
    const advisoryReport = generateContextAwareAdvisory({
      prediction,
      field,
      growthStageInfo,
      weatherInfo,
    });

    // 6. Persist Disease Analysis record in database ONLY for valid predictions
    const analysisRecord = await createAnalysis({
      farmerId: req.farmer._id,
      fieldId: field._id,
      imageUrl,
      predictedCondition: prediction.predictedCondition,
      confidence: prediction.confidence,
      modelName: prediction.modelName || 'rodynaemad/plant-disease-dinov2-small',
      modelVersion: prediction.modelVersion || 'rodynaemad/plant-disease-dinov2-small-onnx-quantized',
      predictionStatus: prediction.predictionStatus || 'classified',
      diagnosisStatus: prediction.diagnosisStatus || prediction.predictionStatus || 'classified',
      confidenceLevel: prediction.confidenceLevel || 'Moderate',
      cropSupported: prediction.cropSupported !== undefined ? prediction.cropSupported : true,
      selectedCrop: prediction.selectedCrop || field.cropName || '',
      imageQuality: prediction.imageQuality || 'good',
      centroidSimilarity: prediction.centroidSimilarity !== undefined ? prediction.centroidSimilarity : null,
      isOutOfDistribution: Boolean(prediction.isOutOfDistribution),
      topPredictions: prediction.topPredictions || [],
      weatherContext: weatherInfo || {},
      conditionDescription: prediction.conditionDescription || '',
      analysisDate: new Date().toISOString(),
    });

    // 7. Persist Advisory record in database
    const advisoryRecord = await createAdvisory({
      analysisId: analysisRecord._id,
      fieldId: field._id,
      possibleCauses: advisoryReport.possibleCauses,
      contributingFactors: advisoryReport.contributingFactors,
      precautions: advisoryReport.precautions,
      recommendedNextSteps: advisoryReport.recommendedNextSteps,
      expertConsultation: advisoryReport.expertConsultation,
      weatherContext: weatherInfo,
    });

    return res.status(201).json({
      success: true,
      message: 'Crop health diagnosis and context-aware advisory generated successfully!',
      analysis: analysisRecord,
      advisory: advisoryRecord,
      report: advisoryReport,
      field,
      growthStage: growthStageInfo,
    });
  } catch (error) {
    console.error('Error during crop prediction & analysis:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process crop leaf analysis. Please try again.',
    });
  }
};

export const getAnalysisHistory = async (req, res) => {
  try {
    const history = await findAnalysesByFarmerId(req.farmer._id);
    return res.json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve analysis history.',
    });
  }
};

export const getAnalysisDetails = async (req, res) => {
  try {
    const analysis = await findAnalysisById(req.params.id, req.farmer._id);
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis report not found or access denied.',
      });
    }

    const advisory = await findAdvisoryByAnalysisId(analysis._id);
    const field = await findFieldById(analysis.fieldId?._id || analysis.fieldId, req.farmer._id);

    let growthStageInfo = null;
    if (field && field.isCropPlanted) {
      growthStageInfo = estimateGrowthStage(field.cropName, field.plantingDate);
    }

    return res.json({
      success: true,
      analysis,
      advisory,
      field,
      growthStage: growthStageInfo,
    });
  } catch (error) {
    console.error('Error fetching analysis details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load analysis details.',
    });
  }
};
