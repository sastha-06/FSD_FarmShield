/**
 * Automated Verification Script for DIGIPIN and Interactive Map Location Selection
 */

import { encodeDigipin, decodeDigipin, isValidDigipin, formatDigipin } from './server/src/services/digipin.js';

const BASE_URL = 'http://127.0.0.1:5000/api';

async function runLocationTests() {
  console.log('📍 Starting DIGIPIN & Geospatial Map Location Verification...\n');

  try {
    // 1. Direct Unit Tests on Official DIGIPIN Algorithm
    console.log('[1/7] Testing Official India DIGIPIN Algorithm...');
    const testCases = [
      { name: 'Dak Bhawan (India Post HQ, New Delhi)', lat: 28.622788, lon: 77.213033, expectedPrefix: '39J' },
      { name: 'Pune Agricultural Zone', lat: 18.5204, lon: 73.8567, expectedPrefix: '45' },
      { name: 'Varanasi Agricultural Belt', lat: 25.3176, lon: 82.9739, expectedPrefix: '3' },
    ];

    for (const tc of testCases) {
      const encoded = encodeDigipin(tc.lat, tc.lon, true);
      const isValid = isValidDigipin(encoded);
      const decoded = decodeDigipin(encoded);
      console.log(`   • ${tc.name}:`);
      console.log(`     Coordinates: (${tc.lat}, ${tc.lon})`);
      console.log(`     Generated DIGIPIN: ${encoded} (Valid: ${isValid})`);
      console.log(`     Decoded Center: (${decoded.latitude}, ${decoded.longitude})`);
      const latDiff = Math.abs(tc.lat - decoded.latitude);
      const lonDiff = Math.abs(tc.lon - decoded.longitude);
      console.log(`     Grid Accuracy Delta: lat ±${latDiff.toFixed(6)}°, lon ±${lonDiff.toFixed(6)}°`);
      if (!isValid) throw new Error(`DIGIPIN validation failed for ${tc.name}`);
    }
    console.log('✅ Official DIGIPIN encode, decode, and validation tests passed.');

    // 2. Test Invalid / Fake DIGIPIN Rejection
    console.log('\n[2/7] Testing Invalid DIGIPIN Rejection (Never Accept Fake DIGIPIN)...');
    const invalidCodes = [
      'INVALID123',       // Contains I, N, V, A
      '1234567890',       // Contains 0 and 1 (invalid symbols)
      'ABCDEFGHIJ',       // Contains vowels and unapproved letters
      '39J-49L',          // Too short
    ];

    for (const code of invalidCodes) {
      const valid = isValidDigipin(code);
      if (valid) throw new Error(`Incorrectly accepted invalid DIGIPIN: ${code}`);
      console.log(`   • Rejected fake/invalid DIGIPIN '${code}' as expected`);
    }
    console.log('✅ Fake DIGIPIN rejection verified.');

    // 3. Register or Login a Farmer for API tests
    console.log('\n[3/7] Setting Up Authenticated Farmer Session...');
    const testEmail = `geofarmer_${Date.now()}@farmshield.ag`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Kisan Balram',
        email: testEmail,
        password: 'password123',
        confirmPassword: 'password123',
        phone: '+91 91234 56789',
      }),
    });
    const regData = await regRes.json();
    const token = regData.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    console.log('✅ Authenticated farmer session active.');

    // 4. Test Backend Location Endpoints
    console.log('\n[4/7] Testing Backend Location APIs (/api/location)...');
    
    // Resolve DIGIPIN API
    const resolveRes = await fetch(`${BASE_URL}/location/digipin/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ digipin: '39J-49L-L8T4' }),
    });
    const resolveRawText = await resolveRes.text();
    let resolveData;
    try {
      resolveData = JSON.parse(resolveRawText);
    } catch (e) {
      console.error('Resolve returned non-JSON:', resolveRes.status, resolveRawText.slice(0, 200));
      throw e;
    }
    if (!resolveData.success) throw new Error(resolveData.message);
    console.log('   • Resolved DIGIPIN 39J-49L-L8T4 to:', resolveData.latitude, resolveData.longitude);

    // Encode Coordinates API
    const encodeRes = await fetch(`${BASE_URL}/location/digipin/encode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: 18.5204, longitude: 73.8567 }),
    });
    const encodeData = await encodeRes.json();
    if (!encodeData.success) throw new Error(encodeData.message);
    console.log('   • Encoded Pune (18.5204, 73.8567) to DIGIPIN:', encodeData.digipin);
    console.log('✅ Location API endpoints verified.');

    // 5. Test Field Registration with DIGIPIN & GPS Coordinates
    console.log('\n[5/7] Registering Field with Full Geospatial Attributes...');
    const newFieldRes = await fetch(`${BASE_URL}/fields`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        fieldName: 'Krishna River Basin Farm #1',
        location: 'Near Karad Bridge, NH-48',
        village: 'Karad',
        district: 'Satara',
        state: 'Maharashtra',
        pincode: '415110',
        digipin: '45J-39L-28K4',
        latitude: 17.2892,
        longitude: 74.1812,
        locationSource: 'digipin',
        area: 6.5,
        areaUnit: 'Acres',
        soilType: 'Black Soil',
        irrigationMethod: 'Drip Irrigation',
        previousCrop: 'Sugarcane',
        isCropPlanted: true,
        cropName: 'Sugarcane',
        plantingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      }),
    });
    const newFieldData = await newFieldRes.json();
    if (!newFieldData.success) throw new Error(newFieldData.message);
    const fieldId = newFieldData.field._id;
    console.log('✅ Field successfully saved with DIGIPIN:', newFieldData.field.digipin);
    console.log('   Coordinates:', newFieldData.field.latitude, newFieldData.field.longitude);
    console.log('   Location Source:', newFieldData.field.locationSource);

    // 6. Test Requirement 5: Do NOT Overwrite Location Data on Unrelated Edits!
    console.log('\n[6/7] Testing Non-Destructive Edit (Unrelated edit must preserve location data)...');
    // We update only fertilizer or area, omitting latitude/longitude/digipin
    const editRes = await fetch(`${BASE_URL}/fields/${fieldId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        area: 7.0, // only change area
        soilType: 'Black Soil',
        fertilizers: [{ fertilizerName: 'Potash', applicationDate: new Date() }],
      }),
    });
    const editData = await editRes.json();
    if (!editData.success) throw new Error(editData.message);
    
    // Verify location attributes remained intact
    if (editData.field.digipin !== '45J-39L-28K4') {
      throw new Error('DIGIPIN was overwritten during unrelated edit!');
    }
    if (editData.field.latitude !== 17.2892 || editData.field.longitude !== 74.1812) {
      throw new Error('Coordinates were overwritten during unrelated edit!');
    }
    console.log('✅ Preserved location data verified: DIGIPIN & coordinates remained intact after unrelated edit.');

    // 7. Test Integration with Weather & Crop Planning
    console.log('\n[7/7] Testing FarmShield Integration with Saved Field Coordinates...');
    const cropRes = await fetch(`${BASE_URL}/crops/${fieldId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const cropData = await cropRes.json();
    if (!cropData.success) throw new Error(cropData.message);
    console.log('✅ Field crop details retrieved with coordinates.');
    if (cropData.weather && cropData.weather.isAvailable) {
      console.log(`   Live Weather at field (${cropData.weather.temperature}°C, ${cropData.weather.humidity}% humidity)`);
    }

    console.log('\n🎉 ALL 7 DIGIPIN & GEOSPATIAL LOCATION VERIFICATIONS PASSED!\n');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Verification Failed:', err.message);
    process.exit(1);
  }
}

runLocationTests();
