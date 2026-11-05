import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '.env') });

import mongoose from 'mongoose';
import {
  classifyCropImage,
  getModelInfo,
  SUPPORTED_CROPS,
  isCropSupported
} from './src/services/aiService.js';
import {
  createAnalysis,
  createAdvisory,
  findAnalysesByFarmerId,
} from './src/services/dataStore.js';
import { generateContextAwareAdvisory } from './src/services/advisoryEngine.js';

let passed = 0;
let total = 0;

function assert(cond, msg) {
  total++;
  if (cond) {
    passed++;
    console.log(`  ✓ PASS: ${msg}`);
  } else {
    console.error(`  ✗ FAIL: ${msg}`);
  }
}

async function runE2E() {
  console.log('====================================================');
  console.log('🌿 FarmShield Local DINOv2 ONNX End-to-End Test Suite');
  console.log('====================================================\n');

  // Test 1: Model Info & Engine Status
  console.log('--- Test Suite 1: Local ONNX Model Engine Status ---');
  const modelInfo = getModelInfo();
  assert(modelInfo.engine === 'ONNX Runtime (Local CPU Node.js)', `Engine is local ONNX Runtime: ${modelInfo.engine}`);
  assert(modelInfo.quantized === true, 'Model is 8-bit quantized');
  assert(fs.existsSync(modelInfo.modelPath), `Model file exists: ${modelInfo.modelPath}`);
  assert(fs.existsSync(modelInfo.centroidsPath), `Centroids file exists: ${modelInfo.centroidsPath}`);
  assert(modelInfo.oodThreshold === 0.6994, `OOD threshold is 0.6994`);

  // Test 2: Real Leaf Inference on Ground-Truth Images
  console.log('\n--- Test Suite 2: Real Image Classification & Top 3 ---');
  const examplesDir = path.resolve(__dirname, 'models', 'examples');
  const tomatoImg = path.join(examplesDir, 'tomato_late_blight.jpg');
  assert(fs.existsSync(tomatoImg), 'Ground-truth tomato late blight image exists');

  const t0 = Date.now();
  const tomatoRes = await classifyCropImage(tomatoImg, 'Tomato');
  const elapsed = Date.now() - t0;
  console.log(`  ℹ Inference time: ${elapsed}ms`);

  assert(tomatoRes.predictionStatus === 'classified', `Prediction status is 'classified' (got ${tomatoRes.predictionStatus})`);
  assert(tomatoRes.crop === 'Tomato', `Crop is Tomato (got ${tomatoRes.crop})`);
  assert(tomatoRes.condition.includes('Late Blight'), `Condition is Late Blight (got ${tomatoRes.condition})`);
  assert(tomatoRes.confidence > 90, `Confidence is > 90% (got ${tomatoRes.confidence}%)`);
  assert(tomatoRes.topPredictions.length === 3, `Returns exactly 3 top candidates (got ${tomatoRes.topPredictions.length})`);
  assert(tomatoRes.isOutOfDistribution === false, `Image is recognized as in-distribution leaf (isOutOfDistribution: false)`);
  assert(tomatoRes.centroidSimilarity >= 0.6994, `Centroid similarity is above threshold (got ${tomatoRes.centroidSimilarity})`);

  console.log(`  Top 3 for Tomato Late Blight:`);
  tomatoRes.topPredictions.forEach((p, i) => {
    console.log(`    ${i + 1}. ${p.crop} — ${p.condition}: ${p.confidence}% (label: ${p.rawLabel})`);
  });

  // Test 3: Potato Early Blight Ground-Truth Image
  const potatoImg = path.join(examplesDir, 'potato_early_blight.jpg');
  if (fs.existsSync(potatoImg)) {
    console.log('\n--- Test Suite 3: Potato Early Blight Classification ---');
    const potatoRes = await classifyCropImage(potatoImg, 'Potato');
    assert(potatoRes.crop === 'Potato', `Potato crop matched (got ${potatoRes.crop})`);
    assert(potatoRes.condition.includes('Early Blight'), `Condition is Early Blight (got ${potatoRes.condition})`);
    assert(potatoRes.confidence > 90, `Confidence > 90% (got ${potatoRes.confidence}%)`);
  }

  // Test 4: Out-Of-Distribution (Non-Leaf Image) Detection
  console.log('\n--- Test Suite 4: Non-Leaf / Out-Of-Distribution Detection ---');
  // Generate a mock non-leaf (flat red patch) image
  const uploadsDir = path.resolve(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  const nonLeafPath = path.join(uploadsDir, 'mock_non_leaf.jpg');

  // Create a 100x100 solid blue JPEG with sharp
  const sharp = (await import('sharp')).default;
  await sharp({
    create: {
      width: 100,
      height: 100,
      channels: 3,
      background: { r: 10, g: 20, b: 240 },
    },
  })
    .jpeg()
    .toFile(nonLeafPath);

  const nonLeafRes = await classifyCropImage(nonLeafPath, 'Tomato');
  assert(nonLeafRes.isOutOfDistribution === true, `Non-leaf detected as Out-Of-Distribution (got isOutOfDistribution: ${nonLeafRes.isOutOfDistribution})`);
  assert(nonLeafRes.centroidSimilarity < 0.6994, `Non-leaf similarity < 0.6994 (got ${nonLeafRes.centroidSimilarity})`);
  assert(nonLeafRes.predictionStatus === 'uncertain', `Status flagged as 'uncertain' due to OOD (got ${nonLeafRes.predictionStatus})`);

  // Test 5: Unsupported Crop Rejection
  console.log('\n--- Test Suite 5: Unsupported Crop Protection ---');
  const unsupportedCropRes = await classifyCropImage(tomatoImg, 'Sugarcane');
  assert(unsupportedCropRes.cropSupported === false, 'Sugarcane is recognized as unsupported');
  assert(unsupportedCropRes.predictionStatus === 'unsupported_crop', 'Status is unsupported_crop');
  assert(unsupportedCropRes.confidence === 0, 'Confidence is 0 for unsupported crops (no synthetic score)');
  assert(unsupportedCropRes.topPredictions.length === 0, 'No top predictions generated for unsupported crop');

  // Test 5B: Rice Disease Classification Engine
  console.log('\n--- Test Suite 5B: Rice Leaf Disease Classification ---');
  const riceRes = await classifyCropImage(tomatoImg, 'Rice');
  assert(riceRes.cropSupported === true, 'Rice is recognized as supported crop');
  assert(riceRes.predictionStatus === 'classified', 'Rice prediction status is classified');
  assert(riceRes.selectedCrop === 'Rice', 'Selected crop is Rice');
  assert(riceRes.confidence > 75, `Rice confidence is high (${riceRes.confidence}%)`);
  assert(riceRes.topPredictions.length === 3, 'Returns exactly 3 top predictions for Rice');
  assert(riceRes.observableSymptoms.length > 0, 'Returns observable symptoms for Rice condition');
  console.log(`    Rice Top Condition: ${riceRes.predictedCondition} (${riceRes.confidence}%)`);


  // Test 6: Persistence to MongoDB Atlas
  console.log('\n--- Test Suite 6: MongoDB Atlas Persistence & History ---');
  const mongoUri = process.env.MONGODB_URI;
  let atlasConnected = false;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000, connectTimeoutMS: 4000 });
      console.log(`  ✓ Connected to MongoDB Atlas: ${mongoose.connection.host}`);
      atlasConnected = true;
    } catch (e) {
      console.log(`  ℹ MongoDB direct connection notice: ${e.message.slice(0, 80)}`);
    }
  }

  const testFarmerId = new mongoose.Types.ObjectId();
  const testFieldId = new mongoose.Types.ObjectId();

  const persistedDoc = await createAnalysis({
    farmerId: testFarmerId,
    fieldId: testFieldId,
    imageUrl: '/uploads/tomato_late_blight.jpg',
    predictedCondition: tomatoRes.predictedCondition,
    confidence: tomatoRes.confidence,
    modelName: tomatoRes.modelName,
    modelVersion: tomatoRes.modelVersion,
    predictionStatus: tomatoRes.predictionStatus,
    diagnosisStatus: 'classified',
    confidenceLevel: tomatoRes.confidenceLevel,
    cropSupported: true,
    selectedCrop: 'Tomato',
    imageQuality: tomatoRes.imageQuality,
    topPredictions: tomatoRes.topPredictions,
    centroidSimilarity: tomatoRes.centroidSimilarity,
    isOutOfDistribution: tomatoRes.isOutOfDistribution,
    conditionDescription: tomatoRes.conditionDescription,
    analysisDate: new Date(),
  });

  assert(Boolean(persistedDoc._id), `Persisted record created with ID: ${persistedDoc._id}`);
  assert(persistedDoc.topPredictions.length === 3, 'Persisted record contains 3 top predictions');
  assert(persistedDoc.isOutOfDistribution === false, 'Persisted record correctly stored isOutOfDistribution: false');
  assert(persistedDoc.centroidSimilarity === tomatoRes.centroidSimilarity && persistedDoc.centroidSimilarity >= 0.6994, `Persisted centroidSimilarity stored correctly: ${persistedDoc.centroidSimilarity}`);

  // Query History
  const history = await findAnalysesByFarmerId(testFarmerId);
  assert(history.length >= 1, `Retrieved ${history.length} records for farmer`);
  assert(history[0].topPredictions[0].crop === 'Tomato', `History record top prediction crop is Tomato`);

  // Clean up
  if (atlasConnected) {
    try {
      await mongoose.model('DiseaseAnalysis').deleteMany({ farmerId: testFarmerId });
      console.log('  ✓ Cleaned up test records from MongoDB Atlas');
      await mongoose.disconnect();
    } catch (_) {}
  }

  // Clean up temporary files
  if (fs.existsSync(nonLeafPath)) {
    fs.unlinkSync(nonLeafPath);
  }

  console.log('\n====================================================');
  console.log(`🏁 All tests completed: ${passed}/${total} passed (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runE2E().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
