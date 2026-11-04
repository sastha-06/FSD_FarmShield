/**
 * End-to-End Automated Verification Script using Node.js 22 Native Fetch & FormData
 */
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://127.0.0.1:5000/api';

async function runTests() {
  console.log('🌱 Starting FarmShield End-to-End Verification (Node.js 22 Native)...\n');
  let authToken = '';
  let farmerId = '';
  let plantedFieldId = '';
  let unplantedFieldId = '';
  let analysisId = '';

  try {
    // 1. Health Check
    console.log('[1/10] Checking Server Health...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    console.log('✅ Server online:', health);

    // 2. Farmer Registration
    console.log('\n[2/10] Testing Farmer Registration...');
    const testEmail = `farmer_${Date.now()}@farmshield.ag`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dr. Ramesh Agro',
        email: testEmail,
        password: 'password123',
        confirmPassword: 'password123',
        phone: '+91 98765 43210',
      }),
    });
    const regData = await regRes.json();
    if (!regData.success) throw new Error(regData.message);
    console.log('✅ Registered:', regData.message);
    authToken = regData.token;
    farmerId = regData.farmer._id;

    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    };

    // 3. Farmer Login
    console.log('\n[3/10] Testing Farmer Login...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123',
      }),
    });
    const loginData = await loginRes.json();
    if (!loginData.success) throw new Error(loginData.message);
    console.log('✅ Login successful for:', loginData.farmer.name);

    // 4. Register Unplanted Field (Case A)
    console.log('\n[4/10] Registering Unplanted Field (Case A)...');
    const unplantedRes = await fetch(`${BASE_URL}/fields`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        fieldName: 'Sunrise Valley Plot A',
        location: 'Near Canal Sluice 3',
        district: 'Pune',
        village: 'Khed',
        area: 3.5,
        areaUnit: 'Acres',
        soilType: 'Alluvial Soil',
        irrigationMethod: 'Drip Irrigation',
        previousCrop: 'Soybean',
        isCropPlanted: false,
      }),
    });
    const unplantedData = await unplantedRes.json();
    if (!unplantedData.success) throw new Error(unplantedData.message);
    unplantedFieldId = unplantedData.field._id;
    console.log('✅ Unplanted Field Created:', unplantedData.field.fieldName);

    // 5. Register Planted Field with Fertilizer Records (Case B)
    console.log('\n[5/10] Registering Planted Field with Fertilizer Records (Case B)...');
    const plantedRes = await fetch(`${BASE_URL}/fields`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        fieldName: 'Riverside Block B',
        location: 'Highway Bypass',
        district: 'Pune',
        village: 'Manchar',
        area: 5.0,
        areaUnit: 'Acres',
        soilType: 'Loamy Soil',
        irrigationMethod: 'Drip Irrigation',
        previousCrop: 'Wheat',
        isCropPlanted: true,
        cropName: 'Tomato',
        cropVariety: 'Pusa Ruby',
        plantingDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
        fertilizers: [
          { fertilizerName: 'DAP (Di-ammonium phosphate)', applicationDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000) },
          { fertilizerName: 'NPK 19:19:19', applicationDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
        ],
      }),
    });
    const plantedData = await plantedRes.json();
    if (!plantedData.success) throw new Error(plantedData.message);
    plantedFieldId = plantedData.field._id;
    console.log('✅ Planted Field Created:', plantedData.field.fieldName, 'with fertilizers:', plantedData.field.fertilizers?.length);

    // 6. Test Smart Crop Recommendations for Unplanted Field (Module 2, Case A)
    console.log('\n[6/10] Testing Smart Crop Recommendations for Unplanted Plot...');
    const recRes = await fetch(`${BASE_URL}/crops/${unplantedFieldId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const recData = await recRes.json();
    if (!recData.success) throw new Error(recData.message);
    console.log('✅ Crop Recommendations generated:');
    console.log('   Season detected:', recData.recommendations.season);
    recData.recommendations.recommendations.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.name} (Score: ${r.score}) - ${r.growingDuration}`);
    });

    // 7. Test Growth Stage Estimation for Planted Field (Module 2, Case B)
    console.log('\n[7/10] Testing Growth Stage Estimation for Planted Plot...');
    const growthRes = await fetch(`${BASE_URL}/crops/${plantedFieldId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const growthData = await growthRes.json();
    if (!growthData.success) throw new Error(growthData.message);
    console.log('✅ Planted Crop Growth Estimation:');
    console.log('   Crop:', growthData.field.cropName);
    console.log('   Days Since Sowing:', growthData.growthStage.daysSincePlanting, 'days');
    console.log('   Estimated Stage:', growthData.growthStage.currentStage);
    console.log('   Lifecycle Progress:', `${growthData.growthStage.progressPercentage}%`);

    // 8. Test AI Disease Inference + Context-Aware Advisory (Modules 3 & 4)
    console.log('\n[8/10] Testing AI Crop Disease Inference & Context-Aware Advisory...');
    const testImgPath = path.resolve('ai_service/test_leaf.jpg');
    const imageBytes = fs.readFileSync(testImgPath);
    const blob = new Blob([imageBytes], { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('fieldId', plantedFieldId);
    formData.append('image', blob, 'test_leaf.jpg');

    const analysisRes = await fetch(`${BASE_URL}/analysis/predict`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: formData,
    });
    const analysisData = await analysisRes.json();
    if (!analysisData.success) throw new Error(analysisData.message);

    console.log('✅ AI Disease Analysis Succeeded!');
    console.log('   Predicted Condition:', analysisData.analysis.predictedCondition);
    console.log('   Model Name:', analysisData.analysis.modelName);
    console.log('   Model Confidence:', `${analysisData.analysis.confidence}%`);
    console.log('   Prediction Status:', analysisData.analysis.predictionStatus);
    console.log('   Context-Aware Advisory Generated:');
    console.log('     Section 1 Status:', analysisData.report.section1.statusLabel);
    console.log('     Section 2 Environmental Factor:', analysisData.report.contributingFactors.environmental.slice(0, 80) + '...');
    console.log('     Section 2 Water Factor:', analysisData.report.contributingFactors.waterManagement.slice(0, 80) + '...');
    console.log('     Section 3 Precautions Count:', analysisData.report.precautions.length);
    console.log('     Section 4 Next Steps Count:', analysisData.report.recommendedNextSteps.length);
    analysisId = analysisData.analysis._id;

    // 9. Test Analysis History & Advisory Retrieval
    console.log('\n[9/10] Testing History & Advisory Retrieval...');
    const historyRes = await fetch(`${BASE_URL}/analysis/history`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const historyData = await historyRes.json();
    console.log(`✅ History count: ${historyData.count} record(s)`);

    const reportRes = await fetch(`${BASE_URL}/analysis/${analysisId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const reportData = await reportRes.json();
    console.log('✅ Full Report retrieved for ID:', reportData.analysis._id);
    console.log('   Associated Field:', reportData.field.fieldName);
    console.log('   Advisory ID:', reportData.advisory._id);

    // 10. Test Dashboard Statistics
    console.log('\n[10/10] Testing Dashboard Statistics from Database...');
    const statsRes = await fetch(`${BASE_URL}/stats/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const statsData = await statsRes.json();
    console.log('✅ Dashboard Stats:');
    console.log('   Total Fields:', statsData.stats.totalFields);
    console.log('   Total Cultivated Area:', `${statsData.stats.totalAreaAcres} Acres`);
    console.log('   Planted Crops:', statsData.stats.plantedCropsCount);
    console.log('   Health Analyses:', statsData.stats.totalAnalyses);
    console.log('   Recent Advisories:', statsData.recentAdvisories.length);

    console.log('\n🎉 ALL 10 END-TO-END VERIFICATION CHECKS PASSED PERFECTLY!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ E2E Test Failed:', err.message);
    process.exit(1);
  }
}

runTests();
