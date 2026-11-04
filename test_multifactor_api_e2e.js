/**
 * FarmShield Multi-Factor API End-to-End Test Suite
 */

const BASE_URL = 'http://127.0.0.1:5000';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

async function runApiTests() {
  console.log('================================================================');
  console.log('🌐 FARMSHIELD MULTI-FACTOR REST API E2E VERIFICATION');
  console.log('================================================================\n');

  try {
    // 1. Health check
    console.log('STEP 1: API Health Check');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const health = await healthRes.json();
    assert(health.status === 'online' || health.status === 'OK', `Server is healthy (${health.status}).`);

    // 2. Authentication
    console.log('\nSTEP 2: Farmer Authentication');
    const email = `farmer_${Date.now()}@farmshield.ag`;
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Murugan Thangavel',
        email,
        password: 'Password123!',
        confirmPassword: 'Password123!',
        phone: '9876543210',
      }),
    });
    const regData = await regRes.json();
    assert(regData.success === true, `Farmer registered with token: ${regData.token?.substring(0, 15)}...`);
    const token = regData.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // 3. Register Field with Full Soil & Water Profile
    console.log('\nSTEP 3: Register Field with Soil & Water Attributes');
    const fieldPayload = {
      fieldName: 'Kaveri Basin South Plot',
      location: 'Near Grand Anicut Sluice, Thanjavur Road',
      village: 'Thiruvaiyaru',
      district: 'Thanjavur',
      state: 'Tamil Nadu',
      pincode: '613204',
      digipin: '39J-49L-L8T4',
      latitude: 10.8784,
      longitude: 79.1066,
      area: 3.5,
      areaUnit: 'Acres',
      soilType: 'Clay Soil',
      soilDrainage: 'Moderate',
      soilPh: 6.7,
      soilNitrogen: 310,
      soilPhosphorus: 24,
      soilPotassium: 220,
      organicCarbon: 0.72,
      electricalConductivity: 0.4,
      zinc: 0.9,
      waterSource: 'Canal',
      waterAvailability: 'High',
      seasonalAvailability: 'Monsoon only',
      irrigationMethod: 'Flood Irrigation',
      irrigationFrequency: 'Weekly',
      previousCrop: 'Black Gram',
      isCropPlanted: false,
    };

    const addFieldRes = await fetch(`${BASE_URL}/api/fields`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(fieldPayload),
    });
    const addFieldData = await addFieldRes.json();
    assert(addFieldData.success === true, `Field created with ID: ${addFieldData.field?._id}`);
    const fieldId = addFieldData.field._id;

    assert(addFieldData.field.soilPh === 6.7, 'Persisted soilPh: 6.7');
    assert(addFieldData.field.waterSource === 'Canal', 'Persisted waterSource: Canal');
    assert(addFieldData.field.waterAvailability === 'High', 'Persisted waterAvailability: High');
    assert(addFieldData.field.soilDrainage === 'Moderate', 'Persisted soilDrainage: Moderate');

    // 4. Retrieve Crop Recommendations & Intelligence for Unplanted Field
    console.log('\nSTEP 4: Retrieve Multi-Factor Crop Recommendations');
    const cropRecRes = await fetch(`${BASE_URL}/api/crops/${fieldId}`, {
      headers: authHeaders,
    });
    const cropRecData = await cropRecRes.json();
    assert(cropRecData.success === true, 'Successfully retrieved field recommendations API.');
    assert(cropRecData.isCropPlanted === false, 'Field confirmed unplanted.');

    const recs = cropRecData.recommendations?.recommendations || [];
    assert(recs.length === 3, `Returned top ${recs.length} multi-factor recommended crops.`);

    const topRec = recs[0];
    console.log(`   Top Recommended Crop: ${topRec.name} (Score: ${topRec.score}/100, Category: ${topRec.suitabilityCategory})`);
    assert(topRec.score >= 50, `Suitability score is high: ${topRec.score}`);
    assert(topRec.individualFactorScores !== undefined, 'Factor-wise score breakdown present.');
    assert(topRec.factorExplanations !== undefined, 'Factor-wise textual explanations present.');
    assert(topRec.profitability !== undefined, 'Profitability estimation integrated into crop card.');

    // Verify Data Completeness
    const comp = cropRecData.recommendations?.dataCompleteness;
    assert(comp && comp.percentage >= 70, `Data completeness calculated: ${comp?.percentage}% (${comp?.statusLabel})`);

    // 5. Test Interactive Profitability API
    console.log('\nSTEP 5: Test Interactive Profitability API with Custom Price');
    const econRes = await fetch(`${BASE_URL}/api/crops/profitability`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        cropName: topRec.shortName,
        areaAcres: 3.5,
        customPricePerUnit: 2500,
      }),
    });
    const econData = await econRes.json();
    assert(econData.success === true, 'Profitability calculation succeeded.');
    assert(econData.data.isCustomPrice === true, 'Custom market price override recognized.');
    assert(econData.data.marketPriceUsed === 2500, 'Custom price ₹2500 used in revenue formula.');
    assert(econData.data.areaAcres === 3.5, 'Scaled to 3.5 acres.');

    // 6. Test Non-Destructive Update to Planted Crop
    console.log('\nSTEP 6: Non-Destructive Field Update to Planted Crop');
    const updateRes = await fetch(`${BASE_URL}/api/fields/${fieldId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        isCropPlanted: true,
        cropName: 'Rice',
        cropVariety: 'CR 1009 Sub 1',
        plantingDate: '2026-09-15',
        fertilizers: [
          { fertilizerName: 'Urea (46% N)', applicationDate: '2026-09-25' },
          { fertilizerName: 'DAP (18:46:0)', applicationDate: '2026-09-15' },
        ],
      }),
    });
    const updateData = await updateRes.json();
    assert(updateData.success === true, 'Field updated to planted.');
    assert(updateData.field.soilPh === 6.7, 'Retained original soilPh: 6.7 non-destructively.');
    assert(updateData.field.waterSource === 'Canal', 'Retained original waterSource: Canal non-destructively.');
    assert(updateData.field.digipin === '39J-49L-L8T4', 'Retained original DIGIPIN non-destructively.');

    // 7. Verify Planted Field Lifecycle Tracking
    console.log('\nSTEP 7: Verify Planted Field Lifecycle & Risk Alerts');
    const plantedRecRes = await fetch(`${BASE_URL}/api/crops/${fieldId}`, {
      headers: authHeaders,
    });
    const plantedData = await plantedRecRes.json();
    assert(plantedData.success === true, 'Retrieved planted field crop details.');
    assert(plantedData.isCropPlanted === true, 'Field confirmed planted.');
    assert(plantedData.growthStage && plantedData.growthStage.daysSincePlanting > 0, `Days elapsed calculated: ${plantedData.growthStage?.daysSincePlanting} days.`);
    assert(plantedData.growthStage.currentStage !== undefined, `Current growth stage: ${plantedData.growthStage?.currentStage}`);

    // Summary
    console.log('\n================================================================');
    console.log(`API E2E TEST COMPLETE: ${passed} / ${total} CHECKS PASSED (${Math.round((passed / total) * 100)}%)`);
    console.log('================================================================\n');

    if (passed === total) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('API E2E Test execution failed:', err);
    process.exit(1);
  }
}

runApiTests();
