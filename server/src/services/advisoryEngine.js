/**
 * FarmShield Context-Aware Agricultural Advisory Engine
 * Combines Hugging Face DINOv2 Computer Vision predictions with registered field agronomic context
 * Integrates: Soil Type, Irrigation Method, Growth Stage, Fertilizer Log, and Live Weather
 */

import { getDiseaseProfile, parseDinoV2Label } from '../data/plantDiseaseData.js';

export const generateContextAwareAdvisory = ({
  prediction,
  field,
  growthStageInfo,
  weatherInfo,
}) => {
  const {
    predictedCondition,
    confidence,
    modelName,
    conditionDescription,
    predictionStatus,
    diagnosisStatus,
    confidenceLevel,
    crop: aiCrop,
    condition,
    isHealthy: isHealthyPrediction,
    topPredictions = [],
    cropMismatchNotice,
  } = prediction;

  const isHealthy = Boolean(isHealthyPrediction || (predictedCondition && predictedCondition.toLowerCase().includes('healthy')));
  const isUncertain = predictionStatus === 'uncertain' || confidenceLevel === 'Low / Uncertain';
  const isUnsupportedCrop = predictionStatus === 'unsupported_crop';
  const isApiUnavailable = predictionStatus === 'api_unavailable';

  // Extract contextual inputs from field
  const fieldName = field.fieldName || 'Registered Field';
  const cropName = field.cropName || aiCrop || 'Field Crop';
  const cropVariety = field.cropVariety ? `(${field.cropVariety})` : '';
  const soilType = field.soilType || 'Soil';
  const irrigationMethod = field.irrigationMethod || 'Standard Irrigation';
  const location = `${field.village ? field.village + ', ' : ''}${field.district || field.location || 'Local Region'}`;
  const fertilizers = field.fertilizers || [];
  const stageName = growthStageInfo?.currentStage || 'Active Vegetation';
  const daysSincePlanting = growthStageInfo?.daysSincePlanting ?? 'Unknown';

  // Retrieve rich pathology profile from plantDiseaseData
  const primaryRawLabel = topPredictions.length > 0 ? topPredictions[0].rawLabel : null;
  const diseaseProfile = primaryRawLabel ? getDiseaseProfile(primaryRawLabel) : null;

  // 1. SECTION 1: AI PREDICTION SUMMARY
  const section1 = {
    predictedCondition: predictedCondition || 'Undetermined Condition',
    confidence: `${confidence}%`,
    confidenceLevel: confidenceLevel || 'Moderate',
    modelName: modelName || 'rodynaemad/plant-disease-dinov2-small',
    modelVersion: modelName || 'rodynaemad/plant-disease-dinov2-small',
    conditionDescription:
      conditionDescription ||
      `Botanical leaf pattern analysis indicates characteristics consistent with ${predictedCondition}.`,
    predictionStatus: predictionStatus || 'classified',
    diagnosisStatus: diagnosisStatus || predictionStatus || 'classified',
    statusLabel: isUnsupportedCrop
      ? `Crop "${cropName}" is outside the 14 PlantVillage trained classes`
      : isApiUnavailable
      ? 'AI Model Service Authentication Required'
      : isHealthy
      ? 'Foliage appears healthy and vigorous'
      : isUncertain
      ? 'Classification requires additional verification'
      : 'Symptomatic foliar stress identified',
    topPredictions,
    cropMismatchNotice,
  };

  // 2. SPECIAL HANDLING: UNSUPPORTED CROPS OR API UNAVAILABLE
  if (isUnsupportedCrop) {
    return {
      section1,
      contributingFactors: {
        environmental: 'Live weather monitoring active for field.',
        waterManagement: `Irrigation method: ${irrigationMethod}.`,
        fertilizerHistory: `Recent applications recorded: ${fertilizers.length}.`,
        growthStage: `Field is currently at ${stageName}.`,
        soilConsiderations: `Soil type: ${soilType}.`,
      },
      possibleCauses: [
        `The current AI vision model is trained strictly on 14 PlantVillage crop species (Apple, Blueberry, Cherry, Corn, Grape, Orange, Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, and Tomato).`,
        `Automated pathology diagnosis is withheld for "${cropName}" to ensure no incorrect treatments or pesticides are administered.`,
      ],
      precautions: [
        `Do not apply broad-spectrum chemical fungicides without laboratory confirmation of the causal agent for ${cropName}.`,
        `Inspect lower stems, roots, and leaf undersides for physical signs of feeding insects, mite webbing, or bacterial oozing.`,
        `Maintain optimal field moisture and sanitation.`,
      ],
      recommendedNextSteps: [
        `Take a fresh plant tissue sample (leaf with stem attachment showing both healthy and symptomatic tissue) in a clean sealable paper bag.`,
        `Contact your local Krishi Vigyan Kendra (KVK) or district agricultural extension officer for diagnostic assistance suited for ${cropName}.`,
        `Document the progression of symptoms across the field over the next 48 to 72 hours.`,
      ],
      expertConsultation: `For ${cropName}, consult your local block agricultural development officer or accredited KVK agronomist.`,
      weatherContext: weatherInfo || { isAvailable: false },
      fieldSnapshot: {
        fieldName,
        cropName: `${cropName} ${cropVariety}`.trim(),
        soilType,
        irrigationMethod,
        location,
        growthStage: stageName,
        daysSincePlanting,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  if (isApiUnavailable) {
    return {
      section1,
      contributingFactors: {
        environmental: 'Service check: Weather integration functional.',
        waterManagement: `Field irrigation: ${irrigationMethod}.`,
        fertilizerHistory: `Fertilizer logs: ${fertilizers.length} entries.`,
        growthStage: `Crop developmental stage: ${stageName}.`,
        soilConsiderations: `Field soil: ${soilType}.`,
      },
      possibleCauses: [
        'Hugging Face API token (HF_TOKEN) is missing or unauthorized in server/.env.',
        'Inference cannot be generated without an authorized API connection to Hugging Face.',
      ],
      precautions: [
        'Ensure HF_TOKEN is configured in server/.env with valid read permissions from huggingface.co/settings/tokens.',
        'Maintain routine preventive crop care while the AI inference link is being established.',
      ],
      recommendedNextSteps: [
        'Add HF_TOKEN=hf_... into your server/.env configuration file and restart the server.',
        'Retry leaf diagnosis once the token is verified.',
      ],
      expertConsultation: 'Contact system administrator to verify API credentials.',
      weatherContext: weatherInfo || { isAvailable: false },
      fieldSnapshot: {
        fieldName,
        cropName: `${cropName} ${cropVariety}`.trim(),
        soilType,
        irrigationMethod,
        location,
        growthStage: stageName,
        daysSincePlanting,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  // 3. SECTION 2: GROUNDED CONTRIBUTING FACTORS
  let environmentalFactor = 'Standard regional conditions.';
  if (weatherInfo && weatherInfo.isAvailable) {
    if (weatherInfo.humidity > 75) {
      environmentalFactor = `High relative humidity (${weatherInfo.humidity}%) recorded at ${weatherInfo.locationName || location}. Prolonged leaf canopy wetness creates microclimates that accelerate spore germination and bacterial entry.`;
    } else if (weatherInfo.humidity < 40) {
      environmentalFactor = `Low atmospheric relative humidity (${weatherInfo.humidity}%) and warm ambient temperatures (${weatherInfo.temperature}°C). May contribute to moisture stress and dry leaf margin scorching.`;
    } else {
      environmentalFactor = `Current ambient temperature is ${weatherInfo.temperature}°C with ${weatherInfo.humidity}% relative humidity (${weatherInfo.weatherCondition}) at ${weatherInfo.locationName || location}.`;
    }
  } else {
    environmentalFactor = 'Live meteorological data was not accessible for this field location; environmental factors are based on seasonal norms.';
  }

  let waterFactor = '';
  if (irrigationMethod === 'Flood Irrigation') {
    waterFactor = `Field utilizes Flood Irrigation. Standing water or soil saturation can impede root oxygenation, prolong lower canopy dampness, and accelerate splash dispersal of ground-borne spores.`;
  } else if (irrigationMethod === 'Sprinkler Irrigation') {
    waterFactor = `Sprinkler irrigation causes direct overhead wetting of leaf surfaces. Overhead splash is a major transmission vector for foliar fungal blights and bacterial spots.`;
  } else if (irrigationMethod === 'Drip Irrigation') {
    waterFactor = `Drip irrigation is actively used, which minimizes foliage wetness and substantially reduces risk of waterborne splash pathogens compared to overhead watering.`;
  } else if (irrigationMethod === 'Rainfed') {
    waterFactor = `Crop is Rainfed. Vulnerability to periodic moisture fluctuations or heavy precipitation runoff that can strip protective foliar wax layers.`;
  } else {
    waterFactor = `Irrigation mode: ${irrigationMethod}. Ensure scheduled delivery avoids prolonged standing water around plant collars.`;
  }

  let fertilizerFactor = '';
  if (fertilizers.length === 0) {
    fertilizerFactor = `No recent fertilizer applications recorded in field history. Sub-optimal plant nutrition (particularly potassium or balanced micronutrients) can lower natural physiological resistance to fungal penetration.`;
  } else {
    const recent = fertilizers[0];
    const fertName = (recent.fertilizerName || '').toLowerCase();
    if (fertName.includes('urea') || fertName.includes('nitrogen') || fertName.includes('dap')) {
      fertilizerFactor = `Last recorded application was ${recent.fertilizerName}. Excessive or unbuffered nitrogen applications promote succulent, tender vegetative tissue that is particularly susceptible to blight and leaf spot pathogens.`;
    } else {
      fertilizerFactor = `Previous recorded application: ${recent.fertilizerName}. Balanced macronutrient maintenance supports cellular wall strength against foliar pathogens.`;
    }
  }

  let growthStageFactor = `Crop is currently at the ${stageName} growth stage (approximately ${daysSincePlanting} days after sowing). Foliage during this phase is actively transpiring, and any reduction in photosynthetic leaf area directly impacts upcoming yield development.`;

  let soilFactor = '';
  if (soilType === 'Clay Soil') {
    soilFactor = `Clay Soil has high moisture retention and slower drainage. In poorly drained field pockets, water stagnation can stress roots and heighten susceptibility to root-stem junction pathogens.`;
  } else if (soilType === 'Sandy Soil') {
    soilFactor = `Sandy Soil exhibits rapid drainage and high nutrient leaching. Micronutrient deficiencies (such as zinc, boron, or magnesium) may manifest as leaf chlorosis resembling pathological spots.`;
  } else if (soilType === 'Black Soil') {
    soilFactor = `Deep Black Soil retains moisture well during dry periods, but can cause localized surface crusting or aeration drops after heavy watering.`;
  } else {
    soilFactor = `${soilType} provides baseline nutrient holding capacity. Maintain balanced organic matter to sustain healthy rhizosphere microbiota.`;
  }

  const contributingFactors = {
    environmental: environmentalFactor,
    waterManagement: waterFactor,
    fertilizerHistory: fertilizerFactor,
    growthStage: growthStageFactor,
    soilConsiderations: soilFactor,
  };

  const possibleCauses = [
    `Microclimate & Atmosphere: ${environmentalFactor}`,
    `Water Delivery Mode: ${waterFactor}`,
    `Nutritional History: ${fertilizerFactor}`,
    `Developmental Phase: ${growthStageFactor}`,
    `Soil Environment: ${soilFactor}`,
  ];

  // 4. SECTION 3: PERSONALIZED PRECAUTIONS
  const precautions = [];
  if (isHealthy) {
    precautions.push('Maintain consistent irrigation scheduling to prevent plant stress spikes.');
    precautions.push('Continue balanced crop nutrition according to regional soil test guidelines.');
    precautions.push('Conduct routine weekly scouting across all field quadrants to catch any early pathogen symptoms.');
    precautions.push('Sanitize field weeding equipment to prevent mechanical transmission of opportunistic pathogens.');
  } else if (diseaseProfile?.management?.cultural) {
    precautions.push(diseaseProfile.management.cultural);
    if (irrigationMethod === 'Sprinkler Irrigation' || irrigationMethod === 'Flood Irrigation') {
      precautions.push('Avoid overhead leaf wetting or standing water to limit splash dispersal of spores.');
    }
    precautions.push('Carefully prune severely blighted lower leaves with sanitized shears and destroy residues away from the field perimeter.');
    precautions.push('Refrain from applying excess urea or high-nitrogen fertilizers until plant health stabilizes.');
    precautions.push('Improve air circulation by maintaining adequate plant spacing and weeding.');
  } else {
    precautions.push('Avoid overhead sprinkler wetting during early morning or late evening to keep foliar drying time minimal.');
    precautions.push('Carefully prune severely blighted lower leaves with sanitized shears and destroy residues away from the field perimeter.');
    precautions.push('Refrain from applying excess urea or high-nitrogen fertilizers until plant health stabilizes.');
    precautions.push(`In ${irrigationMethod === 'Flood Irrigation' ? 'flood irrigated fields' : 'the field'}, maintain unhindered furrow drainage to avert stagnant standing water.`);
    precautions.push('Improve air circulation by providing adequate plant spacing or trellising suited for this growth stage.');
  }

  // 5. SECTION 4: RECOMMENDED NEXT STEPS & TREATMENTS
  const recommendedNextSteps = [];
  if (isHealthy) {
    recommendedNextSteps.push('Document baseline healthy foliage photos for seasonal monitoring.');
    recommendedNextSteps.push('Re-inspect canopy underside and lower stems in 10-14 days.');
    recommendedNextSteps.push('Verify that upcoming fertilizer applications match stage-specific requirements.');
  } else if (isUncertain) {
    recommendedNextSteps.push('Capture a clearer close-up photograph of individual affected leaf blades under bright natural daylight.');
    recommendedNextSteps.push('Inspect the plant stem collar and root zone to rule out soil-borne wilt or nematode damage.');
    recommendedNextSteps.push('Consult a local Krishi Vigyan Kendra (KVK) officer or university agricultural extension agronomist with a physical plant tissue sample.');
  } else {
    // Add specific organic and chemical treatment recommendations from verified database
    if (diseaseProfile?.management?.organic) {
      recommendedNextSteps.push(`Biological / Organic Control: ${diseaseProfile.management.organic}`);
    }
    if (diseaseProfile?.management?.chemical) {
      recommendedNextSteps.push(`Registered Chemical Management: ${diseaseProfile.management.chemical}`);
    }
    recommendedNextSteps.push(`Scout neighboring plants within a 5-meter radius in ${fieldName} to gauge whether symptom distribution is localized or systemic.`);
    recommendedNextSteps.push('Examine leaf undersides with a magnifying hand lens for sporulation or powdery pustules.');
    if (diseaseProfile?.management?.preventive) {
      recommendedNextSteps.push(`Preventive Outlook: ${diseaseProfile.management.preventive}`);
    }
  }

  const expertConsultation = isHealthy
    ? 'Routine agricultural extension check-in is sufficient for this crop cycle.'
    : 'If symptoms rapidly spread across multiple field rows or plant stems exhibit dark cankers, contact your local district agricultural extension office or authorized university farm helpline with physical tissue samples.';

  return {
    section1,
    contributingFactors,
    possibleCauses,
    precautions,
    recommendedNextSteps,
    expertConsultation,
    weatherContext: weatherInfo || { isAvailable: false },
    fieldSnapshot: {
      fieldName,
      cropName: `${cropName} ${cropVariety}`.trim(),
      soilType,
      irrigationMethod,
      location,
      growthStage: stageName,
      daysSincePlanting,
    },
    generatedAt: new Date().toISOString(),
  };
};
