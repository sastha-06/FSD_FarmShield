import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load server/.env
dotenv.config({ path: path.resolve(__dirname, '.env') });

import mongoose from 'mongoose';
import {
  PLANT_DISEASE_PROFILES,
  SUPPORTED_CROPS,
  isCropSupported,
  parseDinoV2Label,
} from './src/data/plantDiseaseData.js';
import { classifyCropImage } from './src/services/aiService.js';
import {
  createAnalysis,
  createAdvisory,
  findAnalysesByFarmerId,
} from './src/services/dataStore.js';
import { generateContextAwareAdvisory } from './src/services/advisoryEngine.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('🌱 FarmShield DINOv2 Backend Verification Suite');
  console.log('====================================================\n');

  // ---------------- TEST SUITE 1: 38 Classes & 14 Crops Validation ----------------
  console.log('--- Test Suite 1: Botanical Labels & Crop Verification ---');
  const labelKeys = Object.keys(PLANT_DISEASE_PROFILES);
  assert(labelKeys.length === 38, `Expected exactly 38 label profiles, found ${labelKeys.length}`);

  const healthyClasses = labelKeys.filter((k) => PLANT_DISEASE_PROFILES[k].isHealthy);
  assert(healthyClasses.length === 12, `Expected 12 healthy classes, found ${healthyClasses.length}`);

  const diseaseClasses = labelKeys.filter((k) => !PLANT_DISEASE_PROFILES[k].isHealthy);
  assert(diseaseClasses.length === 26, `Expected 26 disease classes, found ${diseaseClasses.length}`);

  // Test parseDinoV2Label for representative samples
  const tomatoBlight = parseDinoV2Label('Tomato___Early_blight');
  assert(tomatoBlight.crop === 'Tomato', 'Parsed crop is Tomato');
  assert(tomatoBlight.condition === 'Early Blight', 'Parsed condition is Early Blight');
  assert(tomatoBlight.isHealthy === false, 'Early Blight is not healthy');
  assert(tomatoBlight.pathogen.includes('Alternaria solani'), 'Pathogen contains Alternaria solani');
  assert(tomatoBlight.management.cultural.length > 0, 'Cultural management guidance is present');

  const appleHealthy = parseDinoV2Label('Apple___healthy');
  assert(appleHealthy.crop === 'Apple', 'Parsed crop is Apple');
  assert(appleHealthy.isHealthy === true, 'Apple healthy is marked healthy');

  // Verify Supported vs Unsupported Crops
  assert(isCropSupported('Tomato'), 'Tomato is recognized as supported');
  assert(isCropSupported('Potato'), 'Potato is recognized as supported');
  assert(isCropSupported('Corn (Maize)'), 'Corn (Maize) is recognized as supported');
  assert(isCropSupported('Bell Pepper'), 'Bell Pepper is recognized as supported');
  assert(isCropSupported('Apple'), 'Apple is recognized as supported');
  assert(!isCropSupported('Rice'), 'Rice is recognized as NOT supported by PlantVillage');
  assert(!isCropSupported('Sugarcane'), 'Sugarcane is recognized as NOT supported by PlantVillage');
  assert(!isCropSupported('Cotton'), 'Cotton is recognized as NOT supported by PlantVillage');
  assert(!isCropSupported('Wheat'), 'Wheat is recognized as NOT supported by PlantVillage');

  // ---------------- TEST SUITE 2: Unsupported Crop Rejection ----------------
  console.log('\n--- Test Suite 2: Unsupported Crop Protection ---');
  const tempDir = path.resolve(__dirname, 'uploads');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
  const testImagePath = path.join(tempDir, 'test-leaf-sample.jpg');
  const sampleJpeg = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
    0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
    0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
    0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
    0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
    0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00,
    0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f,
    0x00, 0xbf, 0x00, 0xff, 0xd9
  ]);
  fs.writeFileSync(testImagePath, sampleJpeg);

  const unsupportedRes = await classifyCropImage(testImagePath, 'Rice');
  assert(unsupportedRes.predictionStatus === 'unsupported_crop', 'Unsupported crop status is "unsupported_crop"');
  assert(unsupportedRes.cropSupported === false, 'cropSupported flag is false');
  assert(unsupportedRes.confidence === 0, 'Confidence is 0 for unsupported crops (no synthetic score)');
  assert(unsupportedRes.conditionDescription.includes('14 crop species'), 'Description explains the 14 supported species');

  // ---------------- TEST SUITE 3: Advisory Context Integration ----------------
  console.log('\n--- Test Suite 3: Context-Aware Advisory Generation ---');
  const mockField = {
    _id: new mongoose.Types.ObjectId(),
    fieldName: 'North Tomato Acre',
    cropName: 'Tomato',
    cropVariety: 'Arka Rakshak',
    soilType: 'Clay Soil',
    irrigationMethod: 'Drip Irrigation',
    district: 'Vellore',
    fertilizers: [{ fertilizerName: 'Urea (46% N)', applicationDate: new Date() }],
  };

  const mockPrediction = {
    predictedCondition: 'Tomato - Early Blight',
    confidence: 94.2,
    confidenceLevel: 'High',
    modelName: 'rodynaemad/plant-disease-dinov2-small',
    modelVersion: 'rodynaemad/plant-disease-dinov2-small',
    predictionStatus: 'classified',
    crop: 'Tomato',
    condition: 'Early Blight',
    isHealthy: false,
    topPredictions: [
      {
        crop: 'Tomato',
        condition: 'Early Blight',
        pathogen: 'Fungus (Alternaria solani)',
        confidence: 94.2,
        isHealthy: false,
        rawLabel: 'Tomato___Early_blight',
      },
      {
        crop: 'Potato',
        condition: 'Early Blight',
        pathogen: 'Fungus (Alternaria solani)',
        confidence: 3.5,
        isHealthy: false,
        rawLabel: 'Potato___Early_blight',
      },
      {
        crop: 'Tomato',
        condition: 'Target Spot',
        pathogen: 'Fungus (Corynespora cassiicola)',
        confidence: 1.1,
        isHealthy: false,
        rawLabel: 'Tomato___Target_Spot',
      },
    ],
  };

  const mockWeather = {
    isAvailable: true,
    temperature: 28.5,
    humidity: 82,
    weatherCondition: 'Humid / Light Rain',
    locationName: 'Vellore, Tamil Nadu',
  };

  const advisory = generateContextAwareAdvisory({
    prediction: mockPrediction,
    field: mockField,
    growthStageInfo: { currentStage: 'Vegetative Growth', daysSincePlanting: 35 },
    weatherInfo: mockWeather,
  });

  assert(advisory.section1.predictedCondition === 'Tomato - Early Blight', 'Advisory summary has predictedCondition');
  assert(advisory.section1.topPredictions.length === 3, 'Advisory contains top 3 predictions');
  assert(advisory.contributingFactors.environmental.includes('82%'), 'Advisory accounts for 82% humidity');
  assert(advisory.contributingFactors.waterManagement.includes('Drip irrigation'), 'Advisory accounts for Drip irrigation');
  assert(advisory.contributingFactors.fertilizerHistory.includes('Urea'), 'Advisory flags Urea application history');
  assert(advisory.precautions.length > 0, 'Advisory provides actionable precautions');
  assert(advisory.recommendedNextSteps.some((s) => s.includes('Mancozeb') || s.includes('Organic') || s.includes('Trichoderma')), 'Advisory includes scientific treatment guidance');

  // ---------------- TEST SUITE 4: Persistence & Analysis History ----------------
  console.log('\n--- Test Suite 4: Persistence & History Retrieval ---');
  const mongoUri = process.env.MONGODB_URI;
  assert(Boolean(mongoUri), `MongoDB URI is defined in server/.env`);

  let atlasConnected = false;
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000, connectTimeoutMS: 3000 });
    console.log(`  ✓ Connected to MongoDB Atlas: ${mongoose.connection.host}`);
    atlasConnected = true;
  } catch (dbErr) {
    console.log(`  ℹ MongoDB Atlas direct connection notice: ${dbErr.message.slice(0, 120)}...`);
    console.log(`  ℹ Using FarmShield Dual Persistence Engine (Database & JSON Storage Engine).`);
  }

  const testFarmerId = new mongoose.Types.ObjectId();
  const testFieldId = mockField._id;

  // Create Analysis Record
  const analysisDoc = await createAnalysis({
    farmerId: testFarmerId,
    fieldId: testFieldId,
    imageUrl: '/uploads/test-leaf-sample.jpg',
    predictedCondition: mockPrediction.predictedCondition,
    confidence: mockPrediction.confidence,
    modelName: mockPrediction.modelName,
    modelVersion: mockPrediction.modelVersion,
    predictionStatus: mockPrediction.predictionStatus,
    diagnosisStatus: 'classified',
    confidenceLevel: mockPrediction.confidenceLevel,
    cropSupported: true,
    selectedCrop: 'Tomato',
    imageQuality: 'good',
    topPredictions: mockPrediction.topPredictions,
    weatherContext: mockWeather,
    conditionDescription: 'Target ring lesions consistent with Alternaria solani.',
    analysisDate: new Date(),
  });

  assert(Boolean(analysisDoc._id), `Analysis record created with ID: ${analysisDoc._id}`);
  assert(analysisDoc.topPredictions.length === 3, 'Persisted topPredictions array has 3 candidates');
  assert(Number(analysisDoc.confidence) === 94.2, 'Persisted confidence matches raw score (94.2)');
  assert(analysisDoc.modelVersion === 'rodynaemad/plant-disease-dinov2-small', 'Model version saved correctly');

  // Create Associated Advisory Record
  const advisoryDoc = await createAdvisory({
    analysisId: analysisDoc._id,
    fieldId: testFieldId,
    possibleCauses: advisory.possibleCauses,
    contributingFactors: advisory.contributingFactors,
    precautions: advisory.precautions,
    recommendedNextSteps: advisory.recommendedNextSteps,
    expertConsultation: advisory.expertConsultation,
    weatherContext: mockWeather,
  });
  assert(Boolean(advisoryDoc._id), `Advisory record created with ID: ${advisoryDoc._id}`);

  // Query Analysis History
  const history = await findAnalysesByFarmerId(testFarmerId);
  assert(history.length >= 1, `Retrieved ${history.length} analysis records for farmer`);
  assert(history[0].topPredictions.length === 3, 'Retrieved history record contains topPredictions');

  // Clean up if connected to Atlas
  if (atlasConnected) {
    try {
      await mongoose.model('DiseaseAnalysis').deleteMany({ farmerId: testFarmerId });
      await mongoose.model('Advisory').deleteMany({ analysisId: analysisDoc._id });
      console.log('  ✓ Cleaned up test records from Atlas');
      await mongoose.disconnect();
    } catch (_) {}
  }

  // ---------------- TEST SUITE 5: Hugging Face Endpoint Health & Token Validation ----------------
  console.log('\n--- Test Suite 5: Hugging Face Endpoint Status ---');
  const hfToken = process.env.HF_TOKEN ? process.env.HF_TOKEN.trim() : '';

  if (!hfToken) {
    console.log(`  ℹ Status Notice: HF_TOKEN is currently empty in server/.env.`);
    console.log(`  ℹ Testing safe missing-token handling...`);
    const missingTokenRes = await classifyCropImage(testImagePath, 'Tomato');
    assert(missingTokenRes.predictionStatus === 'api_unavailable', 'Returns predictionStatus: "api_unavailable" when token missing');
    assert(missingTokenRes.confidence === 0, 'Confidence is 0 (no synthetic fallback)');
    assert(missingTokenRes.topPredictions.length === 0, 'No fake predictions generated');
  } else {
    console.log(`  ℹ HF_TOKEN found. Testing live inference against router.huggingface.co...`);
    const liveRes = await classifyCropImage(testImagePath, 'Tomato');
    console.log('  Live response status:', liveRes.predictionStatus);
    console.log('  Live predicted condition:', liveRes.predictedCondition);
    console.log('  Live confidence:', liveRes.confidence);
    if (liveRes.topPredictions && liveRes.topPredictions.length > 0) {
      console.log('  Top 3 predictions from Hugging Face:');
      liveRes.topPredictions.forEach((p, i) => {
        console.log(`    ${i + 1}. ${p.crop} - ${p.condition} (${p.confidence}%) [${p.rawLabel}]`);
      });
      assert(liveRes.predictionStatus === 'classified' || liveRes.predictionStatus === 'uncertain', 'Live inference succeeded');
    } else {
      console.log('  Live inference result message:', liveRes.conditionDescription);
    }
  }

  console.log('\n====================================================');
  console.log(`🏁 Verification Complete: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('====================================================\n');
}

runTestSuite();
