import fs from 'fs';
import path from 'path';
import {
  isCropSupported,
  normalizeCropName,
  parseDinoV2Label,
  SUPPORTED_CROPS,
} from '../data/plantDiseaseData.js';

const HF_ROUTER_BASE = 'https://router.huggingface.co/hf-inference/models';
const DEFAULT_MODEL_ID = 'rodynaemad/plant-disease-dinov2-small';
const TIMEOUT_MS = 25000;

/**
 * Determine MIME type based on file extension
 */
const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.jpg':
    case '.jpeg':
    default:
      return 'image/jpeg';
  }
};

/**
 * Query Hugging Face Hosted Inference Router Endpoint with image buffer
 */
async function queryHuggingFaceRouter(modelId, token, imageBuffer, mimeType, retryOnLoading = true) {
  const url = `${HF_ROUTER_BASE}/${modelId}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const headers = {
      'Content-Type': mimeType,
      'Accept': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token.trim()}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: imageBuffer,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (response.status === 503 && retryOnLoading) {
      // Model is cold/warming up on Hugging Face Serverless infrastructure
      const errBody = await response.json().catch(() => ({}));
      const waitSec = Math.min(Math.ceil(errBody.estimated_time || 5), 8);
      console.warn(`[AI Engine] Hugging Face model is warming up. Retrying after ${waitSec}s...`);
      await new Promise((resolve) => setTimeout(resolve, waitSec * 1000));
      return await queryHuggingFaceRouter(modelId, token, imageBuffer, mimeType, false);
    }

    return response;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Primary AI Crop Disease Classification Service
 * Utilizes hosted rodynaemad/plant-disease-dinov2-small via Hugging Face Inference API
 */
export const classifyCropImage = async (imagePath, cropHint = '') => {
  const modelId = process.env.HF_MODEL_ID || DEFAULT_MODEL_ID;
  const hfToken = process.env.HF_TOKEN ? process.env.HF_TOKEN.trim() : '';

  // 1. Verify Image File Existence and Physical Integrity
  if (!imagePath || !fs.existsSync(imagePath)) {
    return {
      predictionStatus: 'error',
      diagnosisStatus: 'error',
      predictedCondition: 'Image File Not Found',
      confidence: 0,
      confidenceLevel: 'Low / Uncertain',
      modelName: modelId,
      modelVersion: modelId,
      cropSupported: true,
      selectedCrop: cropHint || '',
      conditionDescription: `The specified image file could not be located on the server filesystem.`,
      topPredictions: [],
      observableSymptoms: ['Please re-upload a valid photo of the crop leaf.'],
    };
  }

  const fileStats = fs.statSync(imagePath);
  if (fileStats.size < 120) {
    return {
      predictionStatus: 'uncertain',
      diagnosisStatus: 'uncertain',
      predictedCondition: 'Empty or Corrupt Image File',
      confidence: 0,
      confidenceLevel: 'Low / Uncertain',
      modelName: modelId,
      modelVersion: modelId,
      cropSupported: true,
      selectedCrop: cropHint || '',
      imageQuality: 'flat',
      conditionDescription: 'The uploaded file is empty or corrupted (size < 120 bytes).',
      topPredictions: [],
      observableSymptoms: ['Ensure the photo was fully captured and not interrupted during upload.'],
    };
  }

  // Max 10MB limit check
  if (fileStats.size > 10 * 1024 * 1024) {
    return {
      predictionStatus: 'error',
      diagnosisStatus: 'error',
      predictedCondition: 'File Size Exceeded',
      confidence: 0,
      confidenceLevel: 'Low / Uncertain',
      modelName: modelId,
      modelVersion: modelId,
      cropSupported: true,
      selectedCrop: cropHint || '',
      conditionDescription: 'Image exceeds the maximum allowed file size of 10MB.',
      topPredictions: [],
      observableSymptoms: ['Compress or resize the leaf image before submitting.'],
    };
  }

  // 2. Validate Crop Domain (Only 14 PlantVillage Crops Supported)
  if (cropHint && cropHint.trim()) {
    const isSupported = isCropSupported(cropHint);
    if (!isSupported) {
      const canonical = normalizeCropName(cropHint);
      return {
        predictionStatus: 'unsupported_crop',
        diagnosisStatus: 'unsupported_crop',
        predictedCondition: `Unsupported Crop Domain (${cropHint})`,
        cropSupported: false,
        selectedCrop: cropHint,
        confidence: 0,
        confidenceLevel: 'Low / Uncertain',
        modelName: modelId,
        modelVersion: modelId,
        conditionDescription: `The primary disease classification model (${modelId}) supports 14 crop species: Apple, Blueberry, Cherry, Corn (Maize), Grape, Orange, Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, and Tomato. Field crop "${cropHint}" is outside the trained model domain. Automated prediction is withheld to prevent false agronomic treatments.`,
        topPredictions: [],
        observableSymptoms: [
          `Visual leaf symptoms for ${cropHint} cannot be safely classified by the PlantVillage DINOv2 model.`,
          'Consult local agricultural extension specialists or your Krishi Vigyan Kendra (KVK) for specialized diagnostics.',
        ],
      };
    }
  }

  // 3. Verify Hugging Face Access Token
  if (!hfToken) {
    console.warn('[AI Engine] HF_TOKEN is not configured in server/.env');
    return {
      predictionStatus: 'api_unavailable',
      diagnosisStatus: 'api_unavailable',
      predictedCondition: 'Hugging Face API Token Required',
      confidence: 0,
      confidenceLevel: 'Low / Uncertain',
      modelName: modelId,
      modelVersion: modelId,
      cropSupported: true,
      selectedCrop: cropHint || '',
      conditionDescription: 'A valid Hugging Face Access Token (HF_TOKEN) is required in server/.env to query the hosted DINOv2 inference router endpoint. No synthetic or fabricated predictions were generated.',
      topPredictions: [],
      observableSymptoms: ['System administrator must configure HF_TOKEN in server/.env to activate hosted AI classification.'],
    };
  }

  // 4. Query Hosted Model via Hugging Face Router
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const mimeType = getMimeType(imagePath);

    const response = await queryHuggingFaceRouter(modelId, hfToken, imageBuffer, mimeType);

    if (response.status === 401 || response.status === 403) {
      console.error(`[AI Engine] Hugging Face Authentication failed with status ${response.status}`);
      return {
        predictionStatus: 'api_unavailable',
        diagnosisStatus: 'api_unavailable',
        predictedCondition: 'Hugging Face Authentication Failed',
        confidence: 0,
        confidenceLevel: 'Low / Uncertain',
        modelName: modelId,
        modelVersion: modelId,
        cropSupported: true,
        selectedCrop: cropHint || '',
        conditionDescription: `Hugging Face Router responded with HTTP ${response.status} (Unauthorized/Forbidden). Please ensure the HF_TOKEN in server/.env is valid and has read permissions.`,
        topPredictions: [],
        observableSymptoms: ['Check HF_TOKEN credentials.'],
      };
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[AI Engine] Hugging Face API error ${response.status}: ${errText.slice(0, 300)}`);
      return {
        predictionStatus: 'api_unavailable',
        diagnosisStatus: 'api_unavailable',
        predictedCondition: `AI Model Service Error (HTTP ${response.status})`,
        confidence: 0,
        confidenceLevel: 'Low / Uncertain',
        modelName: modelId,
        modelVersion: modelId,
        cropSupported: true,
        selectedCrop: cropHint || '',
        conditionDescription: `Hosted inference service returned HTTP status ${response.status}.`,
        topPredictions: [],
        observableSymptoms: ['The AI service was temporarily unable to complete inference.'],
      };
    }

    // 5. Parse Raw Model Inference Predictions
    const rawResult = await response.json();

    if (!Array.isArray(rawResult) || rawResult.length === 0) {
      console.error('[AI Engine] Unexpected response format from HF model:', rawResult);
      return {
        predictionStatus: 'uncertain',
        diagnosisStatus: 'uncertain',
        predictedCondition: 'Inconclusive Pattern Analysis',
        confidence: 0,
        confidenceLevel: 'Low / Uncertain',
        modelName: modelId,
        modelVersion: modelId,
        cropSupported: true,
        selectedCrop: cropHint || '',
        conditionDescription: 'The hosted model returned an unparseable response structure.',
        topPredictions: [],
        observableSymptoms: ['Image could not be reliably classified by the vision head.'],
      };
    }

    // Sort predictions descending by score
    const sortedPredictions = [...rawResult].sort((a, b) => (b.score || 0) - (a.score || 0));

    // Extract Top 3 predictions without artificial score alteration
    const top3 = sortedPredictions.slice(0, 3).map((item) => {
      const parsed = parseDinoV2Label(item.label);
      const confPct = Math.round((item.score || 0) * 1000) / 10; // e.g. 0.9456 -> 94.6%
      return {
        crop: parsed.crop,
        condition: parsed.condition,
        pathogen: parsed.pathogen,
        confidence: confPct,
        isHealthy: parsed.isHealthy,
        rawLabel: item.label,
        description: parsed.description,
        symptoms: parsed.observableSymptoms,
      };
    });

    const primary = top3[0];
    const topConfidence = primary.confidence;
    const secondConfidence = top3[1] ? top3[1].confidence : 0;
    const confidenceGap = topConfidence - secondConfidence;

    // Determine Confidence Level objectively
    let confidenceLevel = 'Moderate';
    if (topConfidence >= 75.0 && confidenceGap >= 15.0) {
      confidenceLevel = 'High';
    } else if (topConfidence < 50.0 || confidenceGap < 8.0) {
      confidenceLevel = 'Low / Uncertain';
    }

    // Determine Prediction Status
    let predictionStatus = 'classified';
    let diagnosisStatus = 'classified';
    if (topConfidence < 45.0) {
      predictionStatus = 'uncertain';
      diagnosisStatus = 'uncertain';
    }

    // Format human-friendly condition description
    const fullProfile = parseDinoV2Label(primary.rawLabel);
    let conditionDesc = fullProfile.description;

    // Check crop context alignment
    let cropMismatchNotice = null;
    if (cropHint) {
      const cleanHint = cropHint.toLowerCase();
      const primaryCrop = primary.crop.toLowerCase();
      if (!primaryCrop.includes(cleanHint) && !cleanHint.includes(primaryCrop)) {
        // Top prediction does not match registered crop
        // Check if secondary prediction matches
        const matchingAlt = top3.find((p) => p.crop.toLowerCase().includes(cleanHint));
        if (matchingAlt) {
          cropMismatchNotice = `Note: Primary model prediction identifies "${primary.condition}" on ${primary.crop} (${topConfidence}%), while registered field crop is ${cropHint}. Alternative candidate matching field crop: "${matchingAlt.condition}" (${matchingAlt.confidence}%).`;
        } else {
          cropMismatchNotice = `Note: Model identified characteristics resembling ${primary.crop} (${primary.condition}), differing from the field's registered crop (${cropHint}).`;
        }
      }
    }

    return {
      predictionStatus,
      diagnosisStatus,
      confidenceLevel,
      predictedCondition: `${primary.crop} - ${primary.condition}`,
      confidence: topConfidence,
      modelName: modelId,
      modelVersion: modelId,
      crop: primary.crop,
      condition: primary.condition,
      pathogen: primary.pathogen,
      isHealthy: primary.isHealthy,
      cropSupported: true,
      selectedCrop: cropHint || primary.crop,
      conditionDescription: conditionDesc,
      observableSymptoms: fullProfile.observableSymptoms,
      cropMismatchNotice,
      topPredictions: top3.map((p) => ({
        crop: p.crop,
        condition: p.condition,
        pathogen: p.pathogen,
        confidence: p.confidence,
        isHealthy: p.isHealthy,
        rawLabel: p.rawLabel,
      })),
      isBotanical: true,
      imageQuality: 'good',
    };
  } catch (err) {
    if (err.name === 'AbortError') {
      console.error(`[AI Engine] Request timed out after ${TIMEOUT_MS / 1000} seconds`);
      return {
        predictionStatus: 'api_unavailable',
        diagnosisStatus: 'api_unavailable',
        predictedCondition: 'Inference Request Timeout',
        confidence: 0,
        confidenceLevel: 'Low / Uncertain',
        modelName: modelId,
        modelVersion: modelId,
        cropSupported: true,
        selectedCrop: cropHint || '',
        conditionDescription: `The hosted Hugging Face Inference endpoint did not respond within ${TIMEOUT_MS / 1000} seconds.`,
        topPredictions: [],
        observableSymptoms: ['Check network connectivity or retry the upload.'],
      };
    }

    console.error('[AI Engine] Network or processing error:', err.message);
    return {
      predictionStatus: 'api_unavailable',
      diagnosisStatus: 'api_unavailable',
      predictedCondition: 'Inference Connection Failure',
      confidence: 0,
      confidenceLevel: 'Low / Uncertain',
      modelName: modelId,
      modelVersion: modelId,
      cropSupported: true,
      selectedCrop: cropHint || '',
      conditionDescription: `Failed to contact hosted inference service: ${err.message}`,
      topPredictions: [],
      observableSymptoms: ['Check your internet connection or verify Hugging Face status.'],
    };
  }
};
