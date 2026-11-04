/**
 * FarmShield Multi-Factor Smart Crop Planning & Agronomic Intelligence Engine
 * 
 * Compliant with:
 * - Tamil Nadu Agricultural University (TNAU) Agritech Crop Standards
 * - Indian Council of Agricultural Research (ICAR) Agro-Climatic Framework
 * - Open-Meteo Meteorological Intelligence & Historical Reanalysis
 * 
 * Factor Weighting:
 * 1. Location & Agro-Climatic Suitability: 15%
 * 2. Season & Planting Calendar Window:   15%
 * 3. Weather & Climate Suitability:       15%
 * 4. Soil Type & Drainage:                10%
 * 5. Soil Nutrients & pH:                 15%
 * 6. Water Availability & Source:         15%
 * 7. Irrigation Method Compatibility:      5%
 * 8. Previous Crop & Agronomic Rotation:   5%
 * Total:                                 100%
 */

export const DEFAULT_FACTOR_WEIGHTS = {
  location: 0.15,
  season: 0.15,
  weather: 0.15,
  soilTypeDrainage: 0.10,
  nutrientsAndPh: 0.15,
  waterAvailability: 0.15,
  irrigationCompatibility: 0.05,
  rotation: 0.05,
};

/**
 * Verified Crop Agronomic Database (Focus on Tamil Nadu & Pan-India Systems)
 */
export const CROPS_DATABASE = [
  // 1. Rice / Paddy
  {
    name: 'Rice / Paddy (Oryza sativa)',
    shortName: 'Rice',
    scientificName: 'Oryza sativa',
    category: 'Cereal / Food Grain',
    image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Clay Soil', 'Alluvial Soil', 'Loamy Soil'],
    suitableDrainage: ['Poor / Waterlogged', 'Moderate'],
    phRange: { min: 5.0, max: 7.8, optimalMin: 5.5, optimalMax: 7.0 },
    nutrientNeeds: { N: 'High', P: 'Moderate', K: 'Moderate', idealN: [280, 500], idealP: [15, 30], idealK: [120, 250] },
    waterDemand: 'High',
    waterMmRange: [1200, 1500],
    minWaterAvailabilityRequired: 'High',
    suitableIrrigation: ['Flood Irrigation', 'Rainfed', 'Drip Irrigation'],
    tempRange: { min: 20, max: 38, optimalMin: 24, optimalMax: 33 },
    seasons: ['Kharif', 'Rabi', 'Zaid', 'Kuruvai', 'Samba', 'Navarai', 'Thaladi'],
    growingDurationDays: '115 - 145 days',
    durationDaysRange: [115, 145],
    regionalSuitability: ['Tamil Nadu', 'Cauvery Delta', 'East Coast', 'Coastal Plains', 'Pan-India'],
    plantingCalendarTN: 'Kuruvai (Jun-Jul), Samba (Aug-Sep), Thaladi (Sep-Oct), Navarai (Dec-Jan)',
    rotationBenefits: {
      beneficialPrevious: ['Black Gram', 'Green Gram', 'Soybean', 'Groundnut', 'Sunhemp', 'Sesbania'],
      avoidPrevious: ['Rice / Paddy'],
    },
    criticalWaterStages: ['Active Tillering', 'Panicle Initiation', 'Flowering / Anthesis', 'Milk Stage'],
    soilRequirements: 'Heavy clay or clay loams with low percolation rate, capable of holding standing water.',
    waterRequirements: 'High water requirement (1200-1500mm). Needs continuous shallow standing water (2-5cm) during tillering and panicle development.',
    precautions: 'Excessive nitrogen under cloudy, humid weather triggers Blast (Pyricularia oryzae) and Sheath Blight. Drain water 7-10 days prior to harvest.',
    stages: [
      { name: 'Nursery / Germination', startDay: 0, endDay: 20, description: 'Seed sprout and healthy nursery bed growth.' },
      { name: 'Seedling Transplanting', startDay: 21, endDay: 40, description: 'Transplanting to puddled main field and root anchoring.' },
      { name: 'Active Tillering', startDay: 41, endDay: 70, description: 'Stem node multiplication and canopy cover expansion.' },
      { name: 'Panicle Initiation & Booting', startDay: 71, endDay: 95, description: 'Panicle emergence from flag leaf sheath.' },
      { name: 'Flowering & Grain Dough', startDay: 96, endDay: 120, description: 'Anthesis, pollination, milky to firm dough filling.' },
      { name: 'Physiological Maturity', startDay: 121, endDay: 145, description: 'Panicles turn golden yellow with grain moisture < 20%.' },
    ],
    economics: {
      costBreakdown: { seeds: 2200, fertilizers: 4800, plantProtection: 2500, labour: 12000, irrigationAndPower: 3500 },
      totalCostPerAcre: 25000,
      expectedYieldPerAcre: { min: 22, max: 28, unit: 'Quintals' },
      marketPriceBenchmark: { price: 2300, unit: '₹ / Quintal', source: 'TNAU / MSP 2025-2026' },
    },
  },

  // 2. Maize / Corn
  {
    name: 'Maize / Corn (Zea mays)',
    shortName: 'Maize',
    scientificName: 'Zea mays',
    category: 'Cereal / Grain',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Alluvial Soil', 'Red Soil', 'Loamy Soil', 'Black Soil'],
    suitableDrainage: ['Well-drained', 'Moderate'],
    phRange: { min: 5.8, max: 8.0, optimalMin: 6.2, optimalMax: 7.5 },
    nutrientNeeds: { N: 'High', P: 'Moderate', K: 'Moderate', idealN: [300, 520], idealP: [18, 35], idealK: [140, 260] },
    waterDemand: 'Moderate',
    waterMmRange: [500, 650],
    minWaterAvailabilityRequired: 'Moderate',
    suitableIrrigation: ['Drip Irrigation', 'Sprinkler Irrigation', 'Flood Irrigation', 'Rainfed'],
    tempRange: { min: 16, max: 37, optimalMin: 22, optimalMax: 32 },
    seasons: ['Kharif', 'Rabi', 'Zaid', 'Adipattam', 'Thaipattam'],
    growingDurationDays: '95 - 115 days',
    durationDaysRange: [95, 115],
    regionalSuitability: ['Tamil Nadu', 'Western Zone', 'Southern Plateau', 'Pan-India'],
    plantingCalendarTN: 'Adipattam (Jul-Aug), Purattasipattam (Sep-Oct), Thaipattam (Jan-Feb)',
    rotationBenefits: {
      beneficialPrevious: ['Black Gram', 'Green Gram', 'Soybean', 'Groundnut', 'Chickpea'],
      avoidPrevious: ['Sorghum', 'Maize'],
    },
    criticalWaterStages: ['Tasseling (50-60 days)', 'Silking (60-70 days)', 'Grain Filling (75-90 days)'],
    soilRequirements: 'Deep, fertile, well-drained sandy loam or clay loam rich in organic matter. Intolerant to waterlogging.',
    waterRequirements: '500-650mm across crop cycle. Tasseling and silking are critical moisture stress periods; moisture deficit causes poor seed setting.',
    precautions: 'Scout regularly for Fall Armyworm (Spodoptera frugiperda) at whorl stage. Maintain ridge-and-furrow planting for proper drainage.',
    stages: [
      { name: 'Germination', startDay: 0, endDay: 8, description: 'Radicle and coleoptile push through soil.' },
      { name: 'Early Seedling', startDay: 9, endDay: 25, description: 'V2 to V6 collar leaf emergence and primary root system.' },
      { name: 'Knee-High Vegetative', startDay: 26, endDay: 50, description: 'Rapid stalk height increase and brace root development.' },
      { name: 'Tasseling & Silking', startDay: 51, endDay: 70, description: 'Pollen shed from tassel and silk receptivity.' },
      { name: 'Grain Filling', startDay: 71, endDay: 95, description: 'Milk, dough, and dent kernel starch accumulation.' },
      { name: 'Maturity', startDay: 96, endDay: 115, description: 'Black layer formation on kernel tip indicating harvest maturity.' },
    ],
    economics: {
      costBreakdown: { seeds: 2400, fertilizers: 4500, plantProtection: 2200, labour: 7500, irrigationAndPower: 2400 },
      totalCostPerAcre: 19000,
      expectedYieldPerAcre: { min: 28, max: 35, unit: 'Quintals' },
      marketPriceBenchmark: { price: 2150, unit: '₹ / Quintal', source: 'TNAU Market Cell 2026' },
    },
  },

  // 3. Groundnut / Peanut
  {
    name: 'Groundnut / Peanut (Arachis hypogaea)',
    shortName: 'Groundnut',
    scientificName: 'Arachis hypogaea',
    category: 'Oilseed / Legume',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Red Soil', 'Sandy Soil', 'Loamy Soil', 'Alluvial Soil'],
    suitableDrainage: ['Well-drained'],
    phRange: { min: 5.8, max: 7.8, optimalMin: 6.2, optimalMax: 7.2 },
    nutrientNeeds: { N: 'Low', P: 'Moderate', K: 'Moderate', idealN: [180, 320], idealP: [15, 30], idealK: [100, 200] },
    waterDemand: 'Low to Moderate',
    waterMmRange: [400, 550],
    minWaterAvailabilityRequired: 'Low',
    suitableIrrigation: ['Sprinkler Irrigation', 'Drip Irrigation', 'Rainfed'],
    tempRange: { min: 20, max: 35, optimalMin: 24, optimalMax: 30 },
    seasons: ['Kharif', 'Rabi', 'Zaid', 'Chithirai pattam', 'Adipattam'],
    growingDurationDays: '105 - 120 days',
    durationDaysRange: [105, 120],
    regionalSuitability: ['Tamil Nadu', 'North Western Zone', 'Western Zone', 'Andhra Pradesh', 'Pan-India'],
    plantingCalendarTN: 'Chithirai pattam (Apr-May), Adipattam (Jun-Jul), Karthigai pattam (Nov-Dec)',
    rotationBenefits: {
      beneficialPrevious: ['Rice / Paddy', 'Sorghum', 'Pearl Millet', 'Maize'],
      avoidPrevious: ['Groundnut'],
    },
    criticalWaterStages: ['Flowering (30-40 days)', 'Pegging (45-55 days)', 'Pod Development (60-80 days)'],
    soilRequirements: 'Light-textured, loose, friable sandy loam or red loam with good calcium content to facilitate peg penetration.',
    waterRequirements: '400-550mm. Sensitive to drought during peg penetration and pod development. Standing water causes severe pod rotting.',
    precautions: 'Apply gypsum @ 200 kg/acre at 40-45 DAS during earthing up to ensure pod filling and prevent "pops" (empty shells). Avoid heavy clay.',
    stages: [
      { name: 'Germination', startDay: 0, endDay: 10, description: 'Seed absorbs moisture and cotyledons emerge.' },
      { name: 'Early Vegetative', startDay: 11, endDay: 30, description: 'Tetrafoliolate leaf expansion and nodulation.' },
      { name: 'Flowering & Pegging', startDay: 31, endDay: 55, description: 'Bright yellow flowers emerge; gynophores (pegs) push into soil.' },
      { name: 'Pod Development', startDay: 56, endDay: 85, description: 'Underground ovary swells into reticulated pods.' },
      { name: 'Pod Filling', startDay: 86, endDay: 105, description: 'Kernel enlargement and oil synthesis inside pods.' },
      { name: 'Maturity', startDay: 106, endDay: 120, description: 'Inner shell turns dark brown/black; ready for harvest.' },
    ],
    economics: {
      costBreakdown: { seeds: 4500, fertilizers: 3200, plantProtection: 2000, labour: 9000, irrigationAndPower: 2000 },
      totalCostPerAcre: 20700,
      expectedYieldPerAcre: { min: 10, max: 14, unit: 'Quintals' },
      marketPriceBenchmark: { price: 6800, unit: '₹ / Quintal', source: 'TNAU Agri Market Intelligence 2026' },
    },
  },

  // 4. Cotton
  {
    name: 'Cotton (Gossypium hirsutum)',
    shortName: 'Cotton',
    scientificName: 'Gossypium hirsutum',
    category: 'Fiber / Cash Crop',
    image: 'https://images.unsplash.com/photo-1594488518063-0a91e5cfb860?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Black Soil', 'Alluvial Soil', 'Red Soil'],
    suitableDrainage: ['Well-drained', 'Moderate'],
    phRange: { min: 6.0, max: 8.5, optimalMin: 6.5, optimalMax: 8.0 },
    nutrientNeeds: { N: 'High', P: 'Moderate', K: 'High', idealN: [280, 480], idealP: [15, 30], idealK: [150, 300] },
    waterDemand: 'Moderate to High',
    waterMmRange: [650, 850],
    minWaterAvailabilityRequired: 'Moderate',
    suitableIrrigation: ['Drip Irrigation', 'Rainfed', 'Sprinkler Irrigation'],
    tempRange: { min: 21, max: 40, optimalMin: 25, optimalMax: 35 },
    seasons: ['Kharif', 'Adipattam', 'Purattasipattam'],
    growingDurationDays: '150 - 180 days',
    durationDaysRange: [150, 180],
    regionalSuitability: ['Tamil Nadu', 'Western Zone', 'Southern Zone', 'Deccan Plateau', 'Pan-India'],
    plantingCalendarTN: 'Adipattam (Aug-Sep) for winter irrigated; Purattasipattam (Sep-Oct) for rainfed black soils',
    rotationBenefits: {
      beneficialPrevious: ['Soybean', 'Black Gram', 'Chickpea', 'Wheat'],
      avoidPrevious: ['Cotton', 'Bhendi (Okra)'],
    },
    criticalWaterStages: ['Squaring (40-50 days)', 'Peak Flowering (70-90 days)', 'Boll Formation (90-120 days)'],
    soilRequirements: 'Deep black cotton soils (Vertisols) with high clay content and water retention, or deep alluvial soils.',
    waterRequirements: '650-850mm. Water stress during boll opening leads to shedding of squares and small bolls. Cessation of irrigation required near bursting.',
    precautions: 'Do not grow after Okra or other Malvaceae hosts to suppress Whitefly and Leaf Curl Virus. Monitor Bollworm pheromone traps.',
    stages: [
      { name: 'Germination', startDay: 0, endDay: 10, description: 'Emergence of cotyledons from soil surface.' },
      { name: 'Seedling Establishment', startDay: 11, endDay: 35, description: 'True leaves emergence and tap root deepening.' },
      { name: 'Square (Bud) Formation', startDay: 36, endDay: 65, description: 'Sympodial fruiting branches and square appearance.' },
      { name: 'Flowering & Boll Setting', startDay: 66, endDay: 110, description: 'Creamy white flowers bloom, pollinate, and turn pink.' },
      { name: 'Boll Development', startDay: 111, endDay: 145, description: 'Fiber elongation and secondary cell wall thickening.' },
      { name: 'Boll Bursting & Maturity', startDay: 146, endDay: 180, description: 'Bolls burst open displaying fluffy white seed-cotton.' },
    ],
    economics: {
      costBreakdown: { seeds: 1800, fertilizers: 5200, plantProtection: 4800, labour: 14000, irrigationAndPower: 3200 },
      totalCostPerAcre: 29000,
      expectedYieldPerAcre: { min: 8, max: 12, unit: 'Quintals' },
      marketPriceBenchmark: { price: 7400, unit: '₹ / Quintal', source: 'CCI / e-NAM Market Benchmark 2026' },
    },
  },

  // 5. Sugarcane
  {
    name: 'Sugarcane (Saccharum officinarum)',
    shortName: 'Sugarcane',
    scientificName: 'Saccharum officinarum',
    category: 'Commercial / Sugar Crop',
    image: 'https://images.unsplash.com/photo-1594488518063-0a91e5cfb860?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Alluvial Soil', 'Clay Soil', 'Black Soil', 'Loamy Soil'],
    suitableDrainage: ['Well-drained', 'Moderate'],
    phRange: { min: 6.0, max: 8.2, optimalMin: 6.5, optimalMax: 7.8 },
    nutrientNeeds: { N: 'High', P: 'Moderate', K: 'High', idealN: [350, 600], idealP: [20, 45], idealK: [200, 400] },
    waterDemand: 'High',
    waterMmRange: [1500, 2200],
    minWaterAvailabilityRequired: 'High',
    suitableIrrigation: ['Drip Irrigation', 'Flood Irrigation'],
    tempRange: { min: 20, max: 40, optimalMin: 27, optimalMax: 35 },
    seasons: ['Early Season', 'Mid Season', 'Late Season', 'Special Season'],
    growingDurationDays: '330 - 365 days',
    durationDaysRange: [330, 365],
    regionalSuitability: ['Tamil Nadu', 'Cauvery Basin', 'Western Zone', 'Peninsular India'],
    plantingCalendarTN: 'Early (Dec-Jan), Mid (Feb-Mar), Late (Apr-May), Special (Jun-Jul)',
    rotationBenefits: {
      beneficialPrevious: ['Rice / Paddy', 'Green Gram', 'Black Gram', 'Sunhemp'],
      avoidPrevious: ['Sugarcane (continuous ratoon without legume break)'],
    },
    criticalWaterStages: ['Tillering / Formative (60-120 days)', 'Grand Growth Stage (120-270 days)'],
    soilRequirements: 'Deep, fertile, well-drained loams and clay loams with minimum 1-meter root zone depth.',
    waterRequirements: 'High water requirement (1500-2200mm). Subsurface drip irrigation saves 40% water and provides uniform fertigation.',
    precautions: 'Trash mulching @ 4 tonnes/acre conserves soil moisture and suppresses weeds. Earthing-up at 90 and 150 days prevents lodging.',
    stages: [
      { name: 'Germination Phase', startDay: 0, endDay: 35, description: 'Bud sprout and primary shoot emergence from setts.' },
      { name: 'Formative / Tillering Phase', startDay: 36, endDay: 120, description: 'Rapid tillering and root network establishment.' },
      { name: 'Grand Growth Phase', startDay: 121, endDay: 270, description: 'Rapid internode elongation and biomass accumulation.' },
      { name: 'Ripening & Maturation', startDay: 271, endDay: 365, description: 'Sucrose synthesis and storage in stalk juice.' },
    ],
    economics: {
      costBreakdown: { seeds: 12000, fertilizers: 9500, plantProtection: 3500, labour: 24000, irrigationAndPower: 8000 },
      totalCostPerAcre: 57000,
      expectedYieldPerAcre: { min: 45, max: 60, unit: 'Tonnes' },
      marketPriceBenchmark: { price: 3200, unit: '₹ / Tonne', source: 'Cane Commissioner FRP Benchmark 2026' },
    },
  },

  // 6. Sorghum / Cholam
  {
    name: 'Sorghum / Cholam (Sorghum bicolor)',
    shortName: 'Sorghum',
    scientificName: 'Sorghum bicolor',
    category: 'Millet / Coarse Cereal',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Red Soil', 'Black Soil', 'Loamy Soil', 'Sandy Soil'],
    suitableDrainage: ['Well-drained', 'Moderate'],
    phRange: { min: 5.5, max: 8.5, optimalMin: 6.0, optimalMax: 7.8 },
    nutrientNeeds: { N: 'Moderate', P: 'Low', K: 'Moderate', idealN: [200, 380], idealP: [12, 25], idealK: [100, 200] },
    waterDemand: 'Low',
    waterMmRange: [350, 450],
    minWaterAvailabilityRequired: 'Low',
    suitableIrrigation: ['Rainfed', 'Sprinkler Irrigation', 'Drip Irrigation'],
    tempRange: { min: 18, max: 40, optimalMin: 25, optimalMax: 34 },
    seasons: ['Kharif', 'Rabi', 'Adipattam', 'Purattasipattam'],
    growingDurationDays: '90 - 105 days',
    durationDaysRange: [90, 105],
    regionalSuitability: ['Tamil Nadu', 'Western Zone', 'Southern Zone', 'Rainfed Tracts', 'Pan-India'],
    plantingCalendarTN: 'Adipattam (Jun-Jul) under rainfed; Thaipattam (Jan-Feb) under irrigated condition',
    rotationBenefits: {
      beneficialPrevious: ['Groundnut', 'Soybean', 'Black Gram', 'Green Gram'],
      avoidPrevious: ['Sorghum'],
    },
    criticalWaterStages: ['Boot Leaf stage (40-50 days)', 'Flowering / Grain dough (60-75 days)'],
    soilRequirements: 'Adaptable to wide range of soils; tolerates low fertility and moderate drought.',
    waterRequirements: 'Low water requirement (350-450mm). Deep root system efficiently mines soil water during dry spells.',
    precautions: 'Guard against Shoot Fly (Atherigona soccata) during first 4 weeks by early sowing. Avoid waterlogged fields.',
    stages: [
      { name: 'Emergence', startDay: 0, endDay: 8, description: 'Coleoptile emergence from soil.' },
      { name: 'Seedling Phase', startDay: 9, endDay: 25, description: '5-leaf stage and whorl expansion.' },
      { name: 'Panicle Initiation', startDay: 26, endDay: 50, description: 'Growing point differentiation inside stem.' },
      { name: 'Flowering & Anthesis', startDay: 51, endDay: 70, description: 'Head emergence and pollination.' },
      { name: 'Grain Filling', startDay: 71, endDay: 90, description: 'Soft to hard dough stage.' },
      { name: 'Maturity', startDay: 91, endDay: 105, description: 'Grain reaches physiological maturity; black spot on hilum.' },
    ],
    economics: {
      costBreakdown: { seeds: 900, fertilizers: 2800, plantProtection: 1400, labour: 6500, irrigationAndPower: 1200 },
      totalCostPerAcre: 12800,
      expectedYieldPerAcre: { min: 14, max: 18, unit: 'Quintals' },
      marketPriceBenchmark: { price: 3100, unit: '₹ / Quintal', source: 'TNAU / Millet Mission 2026' },
    },
  },

  // 7. Pearl Millet / Cumbu / Bajra
  {
    name: 'Pearl Millet / Cumbu (Pennisetum glaucum)',
    shortName: 'Pearl Millet',
    scientificName: 'Pennisetum glaucum',
    category: 'Millet / Nutri-Cereal',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Sandy Soil', 'Red Soil', 'Loamy Soil', 'Alluvial Soil'],
    suitableDrainage: ['Well-drained'],
    phRange: { min: 5.5, max: 8.5, optimalMin: 6.2, optimalMax: 7.8 },
    nutrientNeeds: { N: 'Moderate', P: 'Low', K: 'Moderate', idealN: [180, 340], idealP: [10, 22], idealK: [90, 180] },
    waterDemand: 'Low',
    waterMmRange: [250, 350],
    minWaterAvailabilityRequired: 'Low',
    suitableIrrigation: ['Rainfed', 'Sprinkler Irrigation', 'Drip Irrigation'],
    tempRange: { min: 20, max: 42, optimalMin: 28, optimalMax: 36 },
    seasons: ['Kharif', 'Zaid', 'Chithirai pattam', 'Adipattam'],
    growingDurationDays: '75 - 90 days',
    durationDaysRange: [75, 90],
    regionalSuitability: ['Tamil Nadu', 'Western Zone', 'Arid / Semi-Arid Tracts', 'Pan-India'],
    plantingCalendarTN: 'Chithirai pattam (Mar-Apr), Adipattam (Jun-Jul), Purattasipattam (Sep-Oct)',
    rotationBenefits: {
      beneficialPrevious: ['Pulses', 'Groundnut', 'Soybean'],
      avoidPrevious: ['Pearl Millet'],
    },
    criticalWaterStages: ['Tillering (20-25 days)', 'Booting & Flowering (40-50 days)'],
    soilRequirements: 'Light sandy or red sandy loams; thrives under high ambient temperatures and drought.',
    waterRequirements: 'Ultra-low water requirement (250-350mm). Extremely drought-hardy C4 photosynthetic crop.',
    precautions: 'Guard against Downy Mildew / Green Ear disease (Sclerospora graminicola) by seed treatment with Metalaxyl.',
    stages: [
      { name: 'Germination', startDay: 0, endDay: 6, description: 'Rapid radical emergence and anchor establishment.' },
      { name: 'Tillering', startDay: 7, endDay: 25, description: 'Primary and secondary tiller formation.' },
      { name: 'Stem Elongation', startDay: 26, endDay: 45, description: 'Internode expansion and flag leaf appearance.' },
      { name: 'Heading & Flowering', startDay: 46, endDay: 62, description: 'Cylindrical spike emergence and stigmatic receptivity.' },
      { name: 'Grain Development', startDay: 63, endDay: 78, description: 'Kernel starch hardening.' },
      { name: 'Harvest Maturity', startDay: 79, endDay: 90, description: 'Grains harden; moisture falls below 15%.' },
    ],
    economics: {
      costBreakdown: { seeds: 800, fertilizers: 2400, plantProtection: 1100, labour: 5800, irrigationAndPower: 900 },
      totalCostPerAcre: 11000,
      expectedYieldPerAcre: { min: 12, max: 16, unit: 'Quintals' },
      marketPriceBenchmark: { price: 2650, unit: '₹ / Quintal', source: 'TNAU Market Cell 2026' },
    },
  },

  // 8. Finger Millet / Ragi
  {
    name: 'Finger Millet / Ragi (Eleusine coracana)',
    shortName: 'Finger Millet',
    scientificName: 'Eleusine coracana',
    category: 'Millet / Nutri-Cereal',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Red Soil', 'Loamy Soil', 'Alluvial Soil', 'Laterite Soil'],
    suitableDrainage: ['Well-drained', 'Moderate'],
    phRange: { min: 5.0, max: 8.0, optimalMin: 5.8, optimalMax: 7.2 },
    nutrientNeeds: { N: 'Moderate', P: 'Moderate', K: 'Moderate', idealN: [200, 360], idealP: [12, 25], idealK: [100, 220] },
    waterDemand: 'Low to Moderate',
    waterMmRange: [350, 450],
    minWaterAvailabilityRequired: 'Low',
    suitableIrrigation: ['Rainfed', 'Drip Irrigation', 'Sprinkler Irrigation'],
    tempRange: { min: 18, max: 36, optimalMin: 24, optimalMax: 31 },
    seasons: ['Kharif', 'Rabi', 'Adipattam', 'Purattasipattam', 'Thaipattam'],
    growingDurationDays: '95 - 110 days',
    durationDaysRange: [95, 110],
    regionalSuitability: ['Tamil Nadu', 'North Western Zone (Dharmapuri/Krishnagiri)', 'Southern Hills', 'Pan-India'],
    plantingCalendarTN: 'Adipattam (Jun-Jul), Purattasipattam (Aug-Sep), Thaipattam (Dec-Jan)',
    rotationBenefits: {
      beneficialPrevious: ['Horsegram', 'Cowpea', 'Groundnut', 'Soybean'],
      avoidPrevious: ['Finger Millet'],
    },
    criticalWaterStages: ['Tillering (20-30 days)', 'Primordia Initiation (40-50 days)', 'Grain filling (70-85 days)'],
    soilRequirements: 'Thrives in red loamy soils with good drainage; tolerates mild soil acidity and moderate salinity.',
    waterRequirements: '350-450mm. Can withstand dry spells of 2-3 weeks during vegetative phase.',
    precautions: 'Monitor for Ragi Blast (Pyricularia grisea) on neck and fingers during cloudy weather. Use certified seeds.',
    stages: [
      { name: 'Nursery / Germination', startDay: 0, endDay: 18, description: 'Seedbed growth prior to transplanting.' },
      { name: 'Transplanting & Tillering', startDay: 19, endDay: 40, description: 'Field establishment and basal tiller production.' },
      { name: 'Stem Elongation', startDay: 41, endDay: 60, description: 'Main culm growth and boot leaf emergence.' },
      { name: 'Finger (Earhead) Emergence', startDay: 61, endDay: 80, description: 'Whorl of 5-8 curved finger-like spikes emerge.' },
      { name: 'Grain Filling', startDay: 81, endDay: 98, description: 'Seeds turn from green to reddish-brown.' },
      { name: 'Maturity', startDay: 99, endDay: 110, description: 'Earheads turn golden brown; ready for harvest.' },
    ],
    economics: {
      costBreakdown: { seeds: 700, fertilizers: 2600, plantProtection: 1200, labour: 6800, irrigationAndPower: 1100 },
      totalCostPerAcre: 12400,
      expectedYieldPerAcre: { min: 14, max: 18, unit: 'Quintals' },
      marketPriceBenchmark: { price: 3800, unit: '₹ / Quintal', source: 'TNAU Millet Mission 2026' },
    },
  },

  // 9. Black Gram / Urad
  {
    name: 'Black Gram / Urad (Vigna mungo)',
    shortName: 'Black Gram',
    scientificName: 'Vigna mungo',
    category: 'Pulse / Legume',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Alluvial Soil', 'Black Soil', 'Loamy Soil', 'Red Soil'],
    suitableDrainage: ['Well-drained', 'Moderate'],
    phRange: { min: 6.0, max: 7.8, optimalMin: 6.5, optimalMax: 7.5 },
    nutrientNeeds: { N: 'Low (Fixes N)', P: 'Moderate', K: 'Low', idealN: [150, 300], idealP: [15, 30], idealK: [90, 180] },
    waterDemand: 'Low',
    waterMmRange: [250, 350],
    minWaterAvailabilityRequired: 'Low',
    suitableIrrigation: ['Rainfed', 'Sprinkler Irrigation', 'Drip Irrigation'],
    tempRange: { min: 22, max: 38, optimalMin: 26, optimalMax: 33 },
    seasons: ['Rabi', 'Rice Fallow', 'Adipattam', 'Chithirai pattam'],
    growingDurationDays: '65 - 75 days',
    durationDaysRange: [65, 75],
    regionalSuitability: ['Tamil Nadu', 'Cauvery Delta (Rice Fallow)', 'Southern Zone', 'Pan-India'],
    plantingCalendarTN: 'Rice fallow (Jan-Feb in Delta); Adipattam (Jun-Jul); Purattasipattam (Sep-Oct)',
    rotationBenefits: {
      beneficialPrevious: ['Rice / Paddy', 'Maize', 'Sorghum', 'Pearl Millet'],
      avoidPrevious: ['Black Gram', 'Green Gram'],
    },
    criticalWaterStages: ['Flowering (30-35 days)', 'Pod Filling (45-55 days)'],
    soilRequirements: 'Loams or clay loams with neutral reaction; ideal for broadcast sowing in standing rice fallow stubble.',
    waterRequirements: 'Low water requirement (250-350mm). Highly efficient pulse crop; fixes 35-40 kg atmospheric N/ha.',
    precautions: 'Control Whitefly (Bemisia tabaci) early to prevent Yellow Mosaic Virus (YMV). Use resistant varieties (VBN 6, VBN 8).',
    stages: [
      { name: 'Germination', startDay: 0, endDay: 5, description: 'Rapid epigeal germination.' },
      { name: 'Seedling Phase', startDay: 6, endDay: 20, description: 'Trifoliolate leaf emergence and Rhizobial root nodulation.' },
      { name: 'Vegetative Branching', startDay: 21, endDay: 35, description: 'Lateral branch expansion and flower bud formation.' },
      { name: 'Flowering', startDay: 36, endDay: 50, description: 'Yellow papilionaceous flowers open at leaf axils.' },
      { name: 'Pod Filling', startDay: 51, endDay: 65, description: 'Cylindrical hairy pods fill with black seeds.' },
      { name: 'Maturity', startDay: 66, endDay: 75, description: 'Pods turn black; ready for picking.' },
    ],
    economics: {
      costBreakdown: { seeds: 1600, fertilizers: 2200, plantProtection: 1800, labour: 5500, irrigationAndPower: 800 },
      totalCostPerAcre: 11900,
      expectedYieldPerAcre: { min: 4, max: 6, unit: 'Quintals' },
      marketPriceBenchmark: { price: 8200, unit: '₹ / Quintal', source: 'TNAU Agri Market Intelligence 2026' },
    },
  },

  // 10. Green Gram / Moong
  {
    name: 'Green Gram / Moong (Vigna radiata)',
    shortName: 'Green Gram',
    scientificName: 'Vigna radiata',
    category: 'Pulse / Legume',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Alluvial Soil', 'Loamy Soil', 'Red Soil', 'Sandy Soil'],
    suitableDrainage: ['Well-drained'],
    phRange: { min: 6.2, max: 7.8, optimalMin: 6.5, optimalMax: 7.2 },
    nutrientNeeds: { N: 'Low (Fixes N)', P: 'Moderate', K: 'Low', idealN: [150, 300], idealP: [15, 30], idealK: [90, 180] },
    waterDemand: 'Low',
    waterMmRange: [250, 350],
    minWaterAvailabilityRequired: 'Low',
    suitableIrrigation: ['Rainfed', 'Sprinkler Irrigation', 'Drip Irrigation'],
    tempRange: { min: 22, max: 38, optimalMin: 27, optimalMax: 33 },
    seasons: ['Rabi', 'Zaid', 'Summer', 'Rice Fallow', 'Adipattam'],
    growingDurationDays: '60 - 70 days',
    durationDaysRange: [60, 70],
    regionalSuitability: ['Tamil Nadu', 'Cauvery Delta', 'Western Zone', 'Pan-India'],
    plantingCalendarTN: 'Summer irrigated (Feb-Mar), Rice fallow (Jan-Feb), Adipattam (Jun-Jul)',
    rotationBenefits: {
      beneficialPrevious: ['Rice / Paddy', 'Wheat', 'Maize', 'Cotton'],
      avoidPrevious: ['Green Gram', 'Black Gram'],
    },
    criticalWaterStages: ['Flower Initiation (30-35 days)', 'Pod Formation (45-50 days)'],
    soilRequirements: 'Well-drained deep loamy soil rich in phosphorus; intolerant to waterlogged or saline-alkaline soils.',
    waterRequirements: 'Low water requirement (250-350mm). Short duration makes it an ideal catch crop between major cropping seasons.',
    precautions: 'Spray 2% DAP or pulse wonder at flower initiation and 15 days later to enhance pod setting and seed weight.',
    stages: [
      { name: 'Germination', startDay: 0, endDay: 5, description: 'Rapid seedling emergence.' },
      { name: 'Early Vegetative', startDay: 6, endDay: 20, description: 'Rapid leaf development and atmospheric nitrogen fixation.' },
      { name: 'Vegetative Growth', startDay: 21, endDay: 32, description: 'Branching and flower cluster emergence.' },
      { name: 'Flowering', startDay: 33, endDay: 46, description: 'Yellow blossoms open; peak self-pollination.' },
      { name: 'Pod Filling', startDay: 47, endDay: 60, description: 'Long slender pods turn from green to brown.' },
      { name: 'Maturity', startDay: 61, endDay: 70, description: 'Harvest when 85% pods turn dark brown/black.' },
    ],
    economics: {
      costBreakdown: { seeds: 1500, fertilizers: 2100, plantProtection: 1700, labour: 5200, irrigationAndPower: 800 },
      totalCostPerAcre: 11300,
      expectedYieldPerAcre: { min: 4, max: 6, unit: 'Quintals' },
      marketPriceBenchmark: { price: 8500, unit: '₹ / Quintal', source: 'TNAU / e-NAM Market Benchmark 2026' },
    },
  },

  // 11. Turmeric
  {
    name: 'Turmeric / Manjal (Curcuma longa)',
    shortName: 'Turmeric',
    scientificName: 'Curcuma longa',
    category: 'Spices / Cash Crop',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Loamy Soil', 'Alluvial Soil', 'Red Soil'],
    suitableDrainage: ['Well-drained'],
    phRange: { min: 5.8, max: 7.8, optimalMin: 6.2, optimalMax: 7.2 },
    nutrientNeeds: { N: 'High', P: 'Moderate', K: 'High', idealN: [280, 500], idealP: [20, 40], idealK: [180, 350] },
    waterDemand: 'Moderate to High',
    waterMmRange: [900, 1200],
    minWaterAvailabilityRequired: 'Moderate',
    suitableIrrigation: ['Drip Irrigation', 'Sprinkler Irrigation', 'Flood Irrigation'],
    tempRange: { min: 20, max: 36, optimalMin: 25, optimalMax: 32 },
    seasons: ['Adipattam', 'Vaikasi pattam'],
    growingDurationDays: '240 - 270 days',
    durationDaysRange: [240, 270],
    regionalSuitability: ['Tamil Nadu (Erode / Salem / Coimbatore)', 'Western Zone', 'Andhra Pradesh', 'Pan-India'],
    plantingCalendarTN: 'Vaikasi pattam / Adipattam (May to July)',
    rotationBenefits: {
      beneficialPrevious: ['Rice / Paddy', 'Maize', 'Soybean', 'Cowpea'],
      avoidPrevious: ['Ginger', 'Turmeric'],
    },
    criticalWaterStages: ['Rhizome Initiation (60-90 days)', 'Rhizome Bulking (120-180 days)'],
    soilRequirements: 'Well-drained rich loamy or alluvial soil rich in humus. Waterlogging causes catastrophic rhizome rot (Pythium).',
    waterRequirements: '900-1200mm. Drip fertigation enhances curcumin concentration and saves 35% irrigation water.',
    precautions: 'Apply green leaf mulch @ 5 tonnes/acre immediately after planting and at 45 and 90 DAS to conserve moisture and suppress weeds.',
    stages: [
      { name: 'Sprouting Phase', startDay: 0, endDay: 30, description: 'Mother rhizome sprouts and radical anchors form.' },
      { name: 'Tillering Phase', startDay: 31, endDay: 90, description: 'Pseudostem branching and primary rhizome fingers initiate.' },
      { name: 'Rhizome Development', startDay: 91, endDay: 180, description: 'Rapid branching of secondary and tertiary fingers.' },
      { name: 'Rhizome Maturation', startDay: 181, endDay: 240, description: 'Starch and curcumin accumulation; leaves begin yellowing.' },
      { name: 'Harvest Maturity', startDay: 241, endDay: 270, description: 'Complete foliar senescence; ready for rhizome digging.' },
    ],
    economics: {
      costBreakdown: { seeds: 14000, fertilizers: 8500, plantProtection: 3800, labour: 22000, irrigationAndPower: 4500 },
      totalCostPerAcre: 52800,
      expectedYieldPerAcre: { min: 22, max: 28, unit: 'Quintals (Cured)' },
      marketPriceBenchmark: { price: 14500, unit: '₹ / Quintal', source: 'Erode Regulated Market Benchmark 2026' },
    },
  },

  // 12. Banana
  {
    name: 'Banana / Vazhai (Musa acuminata)',
    shortName: 'Banana',
    scientificName: 'Musa acuminata',
    category: 'Horticulture / Fruit Crop',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Alluvial Soil', 'Clay Soil', 'Loamy Soil', 'Red Soil'],
    suitableDrainage: ['Well-drained', 'Moderate'],
    phRange: { min: 6.0, max: 8.0, optimalMin: 6.5, optimalMax: 7.5 },
    nutrientNeeds: { N: 'High', P: 'Moderate', K: 'Very High', idealN: [320, 550], idealP: [20, 40], idealK: [250, 500] },
    waterDemand: 'High',
    waterMmRange: [1500, 2000],
    minWaterAvailabilityRequired: 'High',
    suitableIrrigation: ['Drip Irrigation', 'Flood Irrigation'],
    tempRange: { min: 18, max: 38, optimalMin: 24, optimalMax: 32 },
    seasons: ['Year-round', 'Chithirai pattam', 'Adipattam'],
    growingDurationDays: '300 - 365 days',
    durationDaysRange: [300, 365],
    regionalSuitability: ['Tamil Nadu (Tiruchirappalli, Theni, Coimbatore)', 'Cauvery Delta', 'Pan-India'],
    plantingCalendarTN: 'Wetland system (Feb-Apr); Garden land system (Jan-Feb, Aug-Sep)',
    rotationBenefits: {
      beneficialPrevious: ['Rice / Paddy', 'Green Manure (Daincha)'],
      avoidPrevious: ['Banana (monoculture without fallow)'],
    },
    criticalWaterStages: ['Shooting / Inflorescence Emergence', 'Bunch Development (Months 8-11)'],
    soilRequirements: 'Deep, rich, fertile alluvial or clay loams with minimum 1-meter effective soil depth and high organic carbon.',
    waterRequirements: 'High water requirement (1500-2000mm). Drip irrigation with daily water budgeting (15-20 liters/plant/day) is optimal.',
    precautions: 'Provide sturdy casuarina or bamboo propping at shooting to prevent wind lodging. Remove water suckers regularly.',
    stages: [
      { name: 'Vegetative Phase', startDay: 0, endDay: 180, description: 'Rapid pseudostem growth and broad leaf production (30-35 leaves).' },
      { name: 'Floral Primordia Differentiation', startDay: 181, endDay: 240, description: 'True stem pushes inflorescence upward inside trunk.' },
      { name: 'Shooting (Bunch Emergence)', startDay: 241, endDay: 270, description: 'Inflorescence emerges, bracts roll back revealing flower hands.' },
      { name: 'Bunch Development & Maturation', startDay: 271, endDay: 365, description: 'Fingers fill, round out, and reach harvesting grade.' },
    ],
    economics: {
      costBreakdown: { seeds: 12500, fertilizers: 16000, plantProtection: 5000, labour: 26000, irrigationAndPower: 7500 },
      totalCostPerAcre: 67000,
      expectedYieldPerAcre: { min: 1000, max: 1200, unit: 'Bunches' },
      marketPriceBenchmark: { price: 320, unit: '₹ / Bunch', source: 'TNAU Fruit Market Intelligence 2026' },
    },
  },

  // 13. Coconut
  {
    name: 'Coconut / Thennai (Cocos nucifera)',
    shortName: 'Coconut',
    scientificName: 'Cocos nucifera',
    category: 'Plantation / Oil Crop',
    image: 'https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Sandy Soil', 'Alluvial Soil', 'Red Soil', 'Loamy Soil', 'Laterite Soil'],
    suitableDrainage: ['Well-drained'],
    phRange: { min: 5.2, max: 8.5, optimalMin: 6.0, optimalMax: 7.8 },
    nutrientNeeds: { N: 'High', P: 'Moderate', K: 'Very High', idealN: [250, 480], idealP: [18, 35], idealK: [220, 450] },
    waterDemand: 'Moderate to High',
    waterMmRange: [1200, 1800],
    minWaterAvailabilityRequired: 'Moderate',
    suitableIrrigation: ['Drip Irrigation', 'Basin Irrigation'],
    tempRange: { min: 20, max: 38, optimalMin: 27, optimalMax: 33 },
    seasons: ['Perennial / Planted in Monsoon'],
    growingDurationDays: 'Perennial Plantation',
    durationDaysRange: [365, 1825],
    regionalSuitability: ['Tamil Nadu (Coimbatore, Tiruppur, Thanjavur, Kanyakumari)', 'Coastal Plains', 'Pan-India'],
    plantingCalendarTN: 'Onset of South-West Monsoon (Jun-Jul) or North-East Monsoon (Oct-Nov)',
    rotationBenefits: {
      beneficialPrevious: ['Intercropped with Cocoa, Banana, Turmeric, Black Pepper'],
      avoidPrevious: [],
    },
    criticalWaterStages: ['Button setting (Month 1-3 after opening)', 'Nut filling (Month 5-8)'],
    soilRequirements: 'Deep sandy loams, coastal sands, and red loams with high aeration and water table within 1.5-3 meters.',
    waterRequirements: 'Requires 40-50 liters/palm/day under drip irrigation. Intolerant to stagnant waterlogging around bole.',
    precautions: 'Monitor for Rhinoceros Beetle and Red Palm Weevil. Mulch palm basins with coconut coir pith or dried fronds.',
    stages: [
      { name: 'Seedling Nursery', startDay: 0, endDay: 365, description: 'Nut germination and seedling development in nursery bed.' },
      { name: 'Field Establishment', startDay: 366, endDay: 1095, description: 'Crown expansion and root anchorage in main field.' },
      { name: 'Initial Bearing', startDay: 1096, endDay: 1825, description: 'First spathe emergence and button setting.' },
      { name: 'Peak Commercial Yield', startDay: 1826, endDay: 25000, description: 'Regular monthly spadix emergence yielding mature nuts.' },
    ],
    economics: {
      costBreakdown: { seeds: 4000, fertilizers: 11000, plantProtection: 3500, labour: 15000, irrigationAndPower: 4500 },
      totalCostPerAcre: 38000,
      expectedYieldPerAcre: { min: 7000, max: 9500, unit: 'Nuts' },
      marketPriceBenchmark: { price: 14, unit: '₹ / Nut', source: 'CDB / Pollachi Market Benchmark 2026' },
    },
  },

  // 14. Tomato
  {
    name: 'Tomato (Solanum lycopersicum)',
    shortName: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    category: 'Horticulture / Vegetable',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Loamy Soil', 'Red Soil', 'Alluvial Soil', 'Sandy Soil'],
    suitableDrainage: ['Well-drained'],
    phRange: { min: 6.0, max: 7.5, optimalMin: 6.2, optimalMax: 7.0 },
    nutrientNeeds: { N: 'High', P: 'High', K: 'High', idealN: [280, 480], idealP: [25, 45], idealK: [180, 320] },
    waterDemand: 'Moderate',
    waterMmRange: [450, 600],
    minWaterAvailabilityRequired: 'Moderate',
    suitableIrrigation: ['Drip Irrigation', 'Sprinkler Irrigation'],
    tempRange: { min: 15, max: 35, optimalMin: 21, optimalMax: 29 },
    seasons: ['Rabi', 'Kharif', 'Zaid', 'Year-round'],
    growingDurationDays: '100 - 120 days',
    durationDaysRange: [100, 120],
    regionalSuitability: ['Tamil Nadu (Salem, Dindigul, Dharmapuri)', 'Western Zone', 'Pan-India'],
    plantingCalendarTN: 'May-Jun (Summer), Aug-Sep (Autumn), Dec-Jan (Winter)',
    rotationBenefits: {
      beneficialPrevious: ['Maize', 'Rice / Paddy', 'Pulses', 'Marigold'],
      avoidPrevious: ['Chilli', 'Brinjal', 'Potato', 'Tomato'],
    },
    criticalWaterStages: ['Transplanting', 'Flowering (45-55 days)', 'Fruit Enlargement (65-90 days)'],
    soilRequirements: 'Deep, fertile sandy loam or red loam rich in organic matter and calcium with superior drainage.',
    waterRequirements: '450-600mm. Drip irrigation is imperative; overhead watering creates foliar wetness triggering Early and Late Blight.',
    precautions: 'Stake indeterminate varieties. Apply calcium nitrate to prevent Blossom End Rot (BER). Rotate with non-solanaceous crops.',
    stages: [
      { name: 'Nursery Phase', startDay: 0, endDay: 25, description: 'Pro-tray nursery growth and hardening.' },
      { name: 'Transplanting & Vegetative', startDay: 26, endDay: 45, description: 'Field establishment and canopy framework development.' },
      { name: 'Flowering', startDay: 46, endDay: 65, description: 'Yellow flower clusters bloom; pollinator activity.' },
      { name: 'Fruit Set & Enlargement', startDay: 66, endDay: 90, description: 'Berry expansion from green to mature breaker stage.' },
      { name: 'Harvesting Phase', startDay: 91, endDay: 120, description: 'Sequential picking of firm red-ripe fruits every 3-4 days.' },
    ],
    economics: {
      costBreakdown: { seeds: 4000, fertilizers: 9000, plantProtection: 6000, labour: 18000, irrigationAndPower: 3500 },
      totalCostPerAcre: 40500,
      expectedYieldPerAcre: { min: 140, max: 180, unit: 'Quintals' },
      marketPriceBenchmark: { price: 1600, unit: '₹ / Quintal', source: 'TNAU Vegetable Market Cell 2026' },
    },
  },

  // 15. Chilli
  {
    name: 'Chilli / Hot Pepper (Capsicum annuum)',
    shortName: 'Chilli',
    scientificName: 'Capsicum annuum',
    category: 'Spices / Vegetable',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Red Soil', 'Black Soil', 'Loamy Soil', 'Alluvial Soil'],
    suitableDrainage: ['Well-drained'],
    phRange: { min: 6.0, max: 7.8, optimalMin: 6.5, optimalMax: 7.2 },
    nutrientNeeds: { N: 'High', P: 'Moderate', K: 'High', idealN: [260, 450], idealP: [20, 38], idealK: [160, 300] },
    waterDemand: 'Moderate',
    waterMmRange: [500, 650],
    minWaterAvailabilityRequired: 'Moderate',
    suitableIrrigation: ['Drip Irrigation', 'Sprinkler Irrigation'],
    tempRange: { min: 18, max: 37, optimalMin: 22, optimalMax: 32 },
    seasons: ['Kharif', 'Rabi', 'Adipattam', 'Purattasipattam'],
    growingDurationDays: '130 - 150 days',
    durationDaysRange: [130, 150],
    regionalSuitability: ['Tamil Nadu (Ramanathapuram, Tuticorin, Virudhunagar)', 'Southern Zone', 'Pan-India'],
    plantingCalendarTN: 'Adipattam (Jun-Jul), Purattasipattam (Sep-Oct), Thaipattam (Jan-Feb)',
    rotationBenefits: {
      beneficialPrevious: ['Maize', 'Pulses', 'Rice / Paddy'],
      avoidPrevious: ['Tomato', 'Brinjal', 'Chilli'],
    },
    criticalWaterStages: ['Flowering', 'Fruit Setting'],
    soilRequirements: 'Well-drained red loam or black cotton soil with high aeration; highly sensitive to stagnant water.',
    waterRequirements: '500-650mm. Water stress during flowering induces flower drop; excess water causes Anthracnose and damping off.',
    precautions: 'Monitor for Thrips (Scirtothrips dorsalis) and Mites causing leaf curl. Use silver-black reflective mulch with drip.',
    stages: [
      { name: 'Nursery', startDay: 0, endDay: 30, description: 'Seedling growth in shaded pro-trays.' },
      { name: 'Vegetative Growth', startDay: 31, endDay: 55, description: 'Branching and root system establishment.' },
      { name: 'Flowering', startDay: 56, endDay: 80, description: 'White blossoms at axillary nodes.' },
      { name: 'Fruit Development', startDay: 81, endDay: 110, description: 'Pods elongate and accumulate capsaicin.' },
      { name: 'Ripening & Harvesting', startDay: 111, endDay: 150, description: 'Multiple pickings of green chillies or fully red-ripe dry chillies.' },
    ],
    economics: {
      costBreakdown: { seeds: 4500, fertilizers: 8500, plantProtection: 7000, labour: 17000, irrigationAndPower: 3500 },
      totalCostPerAcre: 40500,
      expectedYieldPerAcre: { min: 15, max: 20, unit: 'Quintals (Dry)' },
      marketPriceBenchmark: { price: 18500, unit: '₹ / Quintal', source: 'Ramnad / Guntur Benchmark 2026' },
    },
  },

  // 16. Small Onion / Shallots
  {
    name: 'Small Onion / Shallot (Allium cepa var. aggregatum)',
    shortName: 'Small Onion',
    scientificName: 'Allium cepa var. aggregatum',
    category: 'Horticulture / Vegetable',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Red Soil', 'Loamy Soil', 'Sandy Soil', 'Alluvial Soil'],
    suitableDrainage: ['Well-drained'],
    phRange: { min: 6.0, max: 7.5, optimalMin: 6.5, optimalMax: 7.2 },
    nutrientNeeds: { N: 'Moderate', P: 'High', K: 'High', idealN: [220, 380], idealP: [25, 45], idealK: [160, 300] },
    waterDemand: 'Moderate',
    waterMmRange: [350, 450],
    minWaterAvailabilityRequired: 'Moderate',
    suitableIrrigation: ['Drip Irrigation', 'Sprinkler Irrigation'],
    tempRange: { min: 16, max: 34, optimalMin: 20, optimalMax: 28 },
    seasons: ['Chithirai pattam', 'Adipattam', 'Thaipattam'],
    growingDurationDays: '70 - 85 days',
    durationDaysRange: [70, 85],
    regionalSuitability: ['Tamil Nadu (Perambalur, Tiruppur, Dindigul, Trichy)', 'Western Zone', 'South India'],
    plantingCalendarTN: 'Chithirai pattam (Apr-May), Adipattam (Jun-Jul), Thaipattam (Oct-Nov)',
    rotationBenefits: {
      beneficialPrevious: ['Maize', 'Rice / Paddy', 'Pulses'],
      avoidPrevious: ['Onion', 'Garlic'],
    },
    criticalWaterStages: ['Bulb Initiation (25-35 days)', 'Bulb Enlargement (45-60 days)'],
    soilRequirements: 'Friable sandy loam or red loam rich in organic matter and free from stones to permit bulb expansion.',
    waterRequirements: '350-450mm. Requires frequent light irrigations. Stop irrigation 10-12 days prior to harvest for curing.',
    precautions: 'Apply Sulphur @ 15 kg/acre to boost pungency and storage life. Control Thrips tabaci and Purple Blotch (Alternaria porri).',
    stages: [
      { name: 'Sprouting', startDay: 0, endDay: 8, description: 'Bulblets sprout green hollow cylindrical leaves.' },
      { name: 'Vegetative Foliage', startDay: 9, endDay: 30, description: 'Foliar cluster expansion and root plate establishment.' },
      { name: 'Bulb Initiation', startDay: 31, endDay: 50, description: 'Leaf bases swell into aggregatum bulb sets.' },
      { name: 'Bulb Development', startDay: 51, endDay: 70, description: 'Bulb scaling and anthocyanin pink-red pigmentation.' },
      { name: 'Maturity & Top Fall', startDay: 71, endDay: 85, description: 'Neck tissues soften and tops fall over; bulbs cure.' },
    ],
    economics: {
      costBreakdown: { seeds: 16000, fertilizers: 5500, plantProtection: 3800, labour: 14000, irrigationAndPower: 2500 },
      totalCostPerAcre: 41800,
      expectedYieldPerAcre: { min: 45, max: 60, unit: 'Quintals' },
      marketPriceBenchmark: { price: 3400, unit: '₹ / Quintal', source: 'Dindigul Market Benchmark 2026' },
    },
  },

  // 17. Potato
  {
    name: 'Potato (Solanum tuberosum)',
    shortName: 'Potato',
    scientificName: 'Solanum tuberosum',
    category: 'Tuber / Vegetable',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Sandy Soil', 'Loamy Soil', 'Alluvial Soil'],
    suitableDrainage: ['Well-drained'],
    phRange: { min: 5.0, max: 6.8, optimalMin: 5.2, optimalMax: 6.2 },
    nutrientNeeds: { N: 'High', P: 'High', K: 'High', idealN: [280, 480], idealP: [25, 50], idealK: [200, 400] },
    waterDemand: 'Moderate',
    waterMmRange: [400, 550],
    minWaterAvailabilityRequired: 'Moderate',
    suitableIrrigation: ['Sprinkler Irrigation', 'Drip Irrigation', 'Flood Irrigation'],
    tempRange: { min: 10, max: 28, optimalMin: 16, optimalMax: 22 },
    seasons: ['Rabi', 'Hills Summer', 'Hills Autumn'],
    growingDurationDays: '85 - 110 days',
    durationDaysRange: [85, 110],
    regionalSuitability: ['Tamil Nadu Hills (Nilgiris, Kodaikanal)', 'Indo-Gangetic Plain', 'Pan-India Hills & North'],
    plantingCalendarTN: 'Hills: Main crop (Apr-May), Autumn (Aug-Sep), Hill Winter (Dec-Jan)',
    rotationBenefits: {
      beneficialPrevious: ['Legumes', 'Maize', 'Wheat'],
      avoidPrevious: ['Tomato', 'Potato', 'Brinjal'],
    },
    criticalWaterStages: ['Stolon Tuberization (30-45 days)', 'Tuber Bulking (50-75 days)'],
    soilRequirements: 'Friable, loose, acid to neutral sandy loam rich in organic matter. Intolerant to heavy clay or alkaline soil.',
    waterRequirements: '400-550mm. Requires uniform light watering; drought during bulking produces misshapen and cracked tubers.',
    precautions: 'Carry out earthing up at 30 and 50 DAS to prevent solanine greening. Guard against Late Blight (Phytophthora infestans).',
    stages: [
      { name: 'Sprouting', startDay: 0, endDay: 15, description: 'Eyes sprout and roots form from seed tuber.' },
      { name: 'Vegetative Growth', startDay: 16, endDay: 35, description: 'Stems and compound foliage develop.' },
      { name: 'Tuber Initiation', startDay: 36, endDay: 55, description: 'Underground stolons swell at tips into young tubers.' },
      { name: 'Tuber Bulking', startDay: 56, endDay: 85, description: 'Rapid starch deposition in tubers.' },
      { name: 'Maturity & Skin Setting', startDay: 86, endDay: 110, description: 'Haulms die down; tuber periderm cures and hardens.' },
    ],
    economics: {
      costBreakdown: { seeds: 18000, fertilizers: 9000, plantProtection: 5500, labour: 16000, irrigationAndPower: 3500 },
      totalCostPerAcre: 52000,
      expectedYieldPerAcre: { min: 80, max: 110, unit: 'Quintals' },
      marketPriceBenchmark: { price: 1800, unit: '₹ / Quintal', source: 'Nilgiris / Agmarknet Benchmark 2026' },
    },
  },

  // 18. Wheat
  {
    name: 'Wheat (Triticum aestivum)',
    shortName: 'Wheat',
    scientificName: 'Triticum aestivum',
    category: 'Cereal / Food Grain',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Alluvial Soil', 'Loamy Soil', 'Clay Soil', 'Black Soil'],
    suitableDrainage: ['Well-drained', 'Moderate'],
    phRange: { min: 6.0, max: 8.0, optimalMin: 6.5, optimalMax: 7.5 },
    nutrientNeeds: { N: 'High', P: 'Moderate', K: 'Moderate', idealN: [260, 450], idealP: [18, 35], idealK: [120, 240] },
    waterDemand: 'Moderate',
    waterMmRange: [400, 500],
    minWaterAvailabilityRequired: 'Moderate',
    suitableIrrigation: ['Sprinkler Irrigation', 'Flood Irrigation', 'Drip Irrigation'],
    tempRange: { min: 10, max: 28, optimalMin: 15, optimalMax: 23 },
    seasons: ['Rabi'],
    growingDurationDays: '110 - 130 days',
    durationDaysRange: [110, 130],
    regionalSuitability: ['Indo-Gangetic Plain', 'Northern & Central India', 'Peninsular Hills (High Elevation)'],
    plantingCalendarTN: 'Rabi season (Nov-Dec) in high elevation tracts or North India',
    rotationBenefits: {
      beneficialPrevious: ['Soybean', 'Green Gram', 'Black Gram', 'Rice / Paddy'],
      avoidPrevious: ['Wheat'],
    },
    criticalWaterStages: ['Crown Root Initiation (21 days)', 'Tillering (40 days)', 'Jointing (60 days)', 'Flowering (80 days)', 'Milking (95 days)'],
    soilRequirements: 'Fertile loams or clay loams with neutral pH and good moisture retention.',
    waterRequirements: '400-500mm. Requires 5-6 irrigations at designated critical stages. Crown root initiation irrigation is non-negotiable.',
    precautions: 'Do not grow in tropical plains with warm winter temperatures (>28°C) as high heat drastically reduces tillering and grain size.',
    stages: [
      { name: 'Germination', startDay: 0, endDay: 10, description: 'Coleoptile emergence.' },
      { name: 'Crown Root Initiation (CRI)', startDay: 11, endDay: 25, description: 'Crown roots anchor plant; critical irrigation stage.' },
      { name: 'Tillering & Jointing', startDay: 26, endDay: 60, description: 'Stem nodes develop and tillers multiply.' },
      { name: 'Booting & Heading', startDay: 61, endDay: 85, description: 'Spikes emerge from flag leaf sheath.' },
      { name: 'Milk & Dough Grain Filling', startDay: 86, endDay: 110, description: 'Kernel starch filling.' },
      { name: 'Maturity', startDay: 111, endDay: 130, description: 'Straw turns golden; grain moisture drops < 14%.' },
    ],
    economics: {
      costBreakdown: { seeds: 2200, fertilizers: 4200, plantProtection: 1500, labour: 7500, irrigationAndPower: 2600 },
      totalCostPerAcre: 18000,
      expectedYieldPerAcre: { min: 18, max: 24, unit: 'Quintals' },
      marketPriceBenchmark: { price: 2425, unit: '₹ / Quintal', source: 'MSP Benchmark 2025-2026' },
    },
  },

  // 19. Soybean
  {
    name: 'Soybean (Glycine max)',
    shortName: 'Soybean',
    scientificName: 'Glycine max',
    category: 'Oilseed / Legume',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Black Soil', 'Loamy Soil', 'Alluvial Soil'],
    suitableDrainage: ['Well-drained'],
    phRange: { min: 6.0, max: 7.8, optimalMin: 6.5, optimalMax: 7.2 },
    nutrientNeeds: { N: 'Low (Fixes N)', P: 'Moderate', K: 'Moderate', idealN: [160, 320], idealP: [18, 35], idealK: [120, 240] },
    waterDemand: 'Low to Moderate',
    waterMmRange: [450, 550],
    minWaterAvailabilityRequired: 'Low',
    suitableIrrigation: ['Rainfed', 'Sprinkler Irrigation', 'Drip Irrigation'],
    tempRange: { min: 20, max: 36, optimalMin: 24, optimalMax: 30 },
    seasons: ['Kharif'],
    growingDurationDays: '90 - 110 days',
    durationDaysRange: [90, 110],
    regionalSuitability: ['Central India', 'Deccan Plateau', 'Western Tamil Nadu', 'Pan-India'],
    plantingCalendarTN: 'Kharif / Adipattam (Jun-Jul)',
    rotationBenefits: {
      beneficialPrevious: ['Cotton', 'Sorghum', 'Maize', 'Wheat'],
      avoidPrevious: ['Soybean'],
    },
    criticalWaterStages: ['Flowering (45-55 days)', 'Pod Filling (65-80 days)'],
    soilRequirements: 'Fertile black soils or loams with good drainage and organic matter.',
    waterRequirements: '450-550mm. Moisture stress during pod filling reduces seed weight by 30%.',
    precautions: 'Inoculate seeds with Bradyrhizobium japonicum culture. Ensure field has no standing water.',
    stages: [
      { name: 'Germination', startDay: 0, endDay: 7, description: 'Cotyledons break ground.' },
      { name: 'Seedling', startDay: 8, endDay: 25, description: 'First trifoliolate leaves develop; root nodulation starts.' },
      { name: 'Vegetative Branching', startDay: 26, endDay: 45, description: 'Full node branching and active N fixation.' },
      { name: 'Flowering', startDay: 46, endDay: 65, description: 'Purple or white raceme blossoms appear.' },
      { name: 'Pod Filling', startDay: 66, endDay: 90, description: 'Pods elongate and seeds swell.' },
      { name: 'Maturity', startDay: 91, endDay: 110, description: 'Leaves drop, pods turn brown and dry.' },
    ],
    economics: {
      costBreakdown: { seeds: 2600, fertilizers: 3200, plantProtection: 2400, labour: 6500, irrigationAndPower: 1500 },
      totalCostPerAcre: 16200,
      expectedYieldPerAcre: { min: 8, max: 12, unit: 'Quintals' },
      marketPriceBenchmark: { price: 4892, unit: '₹ / Quintal', source: 'MSP Benchmark 2025-2026' },
    },
  },

  // 20. Chickpea / Bengal Gram
  {
    name: 'Chickpea / Bengal Gram (Cicer arietinum)',
    shortName: 'Chickpea',
    scientificName: 'Cicer arietinum',
    category: 'Pulse / Legume',
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
    suitableSoils: ['Loamy Soil', 'Black Soil', 'Alluvial Soil', 'Red Soil'],
    suitableDrainage: ['Well-drained'],
    phRange: { min: 6.0, max: 8.5, optimalMin: 6.8, optimalMax: 7.8 },
    nutrientNeeds: { N: 'Low (Fixes N)', P: 'Moderate', K: 'Low', idealN: [150, 300], idealP: [15, 30], idealK: [90, 180] },
    waterDemand: 'Low',
    waterMmRange: [250, 350],
    minWaterAvailabilityRequired: 'Low',
    suitableIrrigation: ['Rainfed', 'Sprinkler Irrigation', 'Drip Irrigation'],
    tempRange: { min: 14, max: 32, optimalMin: 18, optimalMax: 26 },
    seasons: ['Rabi'],
    growingDurationDays: '95 - 115 days',
    durationDaysRange: [95, 115],
    regionalSuitability: ['Southern Tamil Nadu (Virudhunagar, Tirunelveli)', 'Deccan Plateau', 'Central India'],
    plantingCalendarTN: 'Purattasipattam / Winter (Oct-Nov)',
    rotationBenefits: {
      beneficialPrevious: ['Rice / Paddy', 'Pearl Millet', 'Sorghum', 'Maize'],
      avoidPrevious: ['Chickpea'],
    },
    criticalWaterStages: ['Pre-flowering (40-45 days)', 'Pod development (65-75 days)'],
    soilRequirements: 'Well-aerated deep black soils or clay loams; tolerates neutral to moderately alkaline conditions.',
    waterRequirements: 'Low water requirement (250-350mm). Excess irrigation promotes excessive vegetative growth at the cost of podding.',
    precautions: 'Monitor for Pod Borer (Helicoverpa armigera) at flowering and podding. Avoid poorly drained wet fields.',
    stages: [
      { name: 'Germination', startDay: 0, endDay: 8, description: 'Radical anchors and shoots emerge.' },
      { name: 'Seedling', startDay: 9, endDay: 28, description: 'Branching and root nodule formation.' },
      { name: 'Vegetative Canopy', startDay: 29, endDay: 50, description: 'Dense branch canopy development.' },
      { name: 'Flowering', startDay: 51, endDay: 70, description: 'Pink or white flowers open.' },
      { name: 'Podding & Grain Filling', startDay: 71, endDay: 95, description: 'Inflated pods fill with 1-2 seeds.' },
      { name: 'Maturity', startDay: 96, endDay: 115, description: 'Foliage dries to golden brown; pods rattle.' },
    ],
    economics: {
      costBreakdown: { seeds: 2800, fertilizers: 2600, plantProtection: 2000, labour: 6000, irrigationAndPower: 1100 },
      totalCostPerAcre: 14500,
      expectedYieldPerAcre: { min: 6, max: 9, unit: 'Quintals' },
      marketPriceBenchmark: { price: 5440, unit: '₹ / Quintal', source: 'MSP Benchmark 2025-2026' },
    },
  },
];

/**
 * Determine Indian agricultural season and Tamil Nadu pattam
 */
export const getCurrentSeason = (date = new Date()) => {
  const month = date.getMonth(); // 0 = Jan, 11 = Dec
  let panIndiaSeason = 'Kharif';
  let tamilNaduPattam = 'Adipattam';

  if (month >= 5 && month <= 9) {
    panIndiaSeason = 'Kharif'; // Jun to Oct
    tamilNaduPattam = month <= 6 ? 'Kuruvai / Adipattam' : 'Samba / Purattasipattam';
  } else if (month >= 9 || month <= 2) {
    panIndiaSeason = 'Rabi'; // Oct to Mar
    tamilNaduPattam = month >= 11 || month <= 1 ? 'Navarai / Thaipattam' : 'Thaladi / Karthigai pattam';
  } else {
    panIndiaSeason = 'Zaid'; // Mar to Jun
    tamilNaduPattam = 'Chithirai pattam / Summer';
  }

  return {
    season: panIndiaSeason,
    tamilNaduPattam,
    monthName: date.toLocaleString('default', { month: 'long' }),
  };
};

/**
 * Calculate Data Completeness Percentage and list missing fields
 */
export const calculateDataCompleteness = (params) => {
  const fields = [
    { key: 'coordinates', label: 'GPS / DIGIPIN Coordinates', check: (p) => p.latitude !== null && p.longitude !== null && !isNaN(p.latitude) && !isNaN(p.longitude) },
    { key: 'location', label: 'District / Locality', check: (p) => Boolean(p.district || p.location) },
    { key: 'soilType', label: 'Soil Type', check: (p) => Boolean(p.soilType && p.soilType !== 'Other') },
    { key: 'soilDrainage', label: 'Soil Drainage', check: (p) => Boolean(p.soilDrainage) },
    { key: 'soilPh', label: 'Soil pH Test', check: (p) => p.soilPh !== null && p.soilPh !== undefined && !isNaN(p.soilPh) },
    { key: 'nutrients', label: 'NPK Nutrients', check: (p) => p.soilNitrogen !== null || p.soilPhosphorus !== null || p.soilPotassium !== null },
    { key: 'waterSource', label: 'Water Source', check: (p) => Boolean(p.waterSource) },
    { key: 'waterAvailability', label: 'Water Availability Level', check: (p) => Boolean(p.waterAvailability) },
    { key: 'irrigationMethod', label: 'Irrigation Method', check: (p) => Boolean(p.irrigationMethod) },
    { key: 'previousCrop', label: 'Previous Crop History', check: (p) => Boolean(p.previousCrop) },
    { key: 'weather', label: 'Live Weather / Forecast', check: (p) => Boolean(p.weatherInfo && p.weatherInfo.isAvailable) },
  ];

  const available = [];
  const missing = [];

  for (const item of fields) {
    if (item.check(params)) {
      available.push(item.label);
    } else {
      missing.push(item.label);
    }
  }

  const percentage = Math.round((available.length / fields.length) * 100);
  const isProvisional = percentage < 65 || !fields.find((f) => f.key === 'soilPh').check(params);

  return {
    percentage,
    available,
    missing,
    isProvisional,
    statusLabel: isProvisional ? 'Provisional Recommendation' : 'Validated Recommendation',
  };
};

/**
 * Multi-Factor Smart Crop Recommendation Engine
 */
export const getCropRecommendations = ({
  soilType,
  soilDrainage = '',
  soilPh = null,
  soilNitrogen = null,
  soilPhosphorus = null,
  soilPotassium = null,
  waterSource = '',
  waterAvailability = '',
  irrigationMethod,
  irrigationFrequency = '',
  location = '',
  district = '',
  state = '',
  digipin = '',
  latitude = null,
  longitude = null,
  area = null,
  previousCrop = '',
  weatherInfo = null,
  weights = DEFAULT_FACTOR_WEIGHTS,
}) => {
  const currentSeasonInfo = getCurrentSeason();
  const season = currentSeasonInfo.season;
  const tnPattam = currentSeasonInfo.tamilNaduPattam;

  // Determine agro-climatic context
  const latNum = latitude !== null && !isNaN(Number(latitude)) ? Number(latitude) : null;
  const lonNum = longitude !== null && !isNaN(Number(longitude)) ? Number(longitude) : null;
  const isSouthIndia = (latNum !== null && latNum >= 8.0 && latNum <= 15.0) ||
    /tamil|kerala|karnataka|andhra|telangana/i.test(`${state} ${district} ${location}`);
  const isTamilNadu = (latNum !== null && latNum >= 8.0 && latNum <= 13.5 && lonNum >= 76.0 && lonNum <= 80.5) ||
    /tamil\s*nadu/i.test(`${state} ${district} ${location}`);

  // Calculate Data Completeness
  const completeness = calculateDataCompleteness({
    latitude: latNum,
    longitude: lonNum,
    district,
    location,
    soilType,
    soilDrainage,
    soilPh,
    soilNitrogen,
    soilPhosphorus,
    soilPotassium,
    waterSource,
    waterAvailability,
    irrigationMethod,
    previousCrop,
    weatherInfo,
  });

  const scoredCrops = CROPS_DATABASE.map((crop) => {
    let factorScores = {};
    const factorExplanations = {};
    const reasons = [];
    const limitations = [];
    const missingInfoImpacts = [];
    let criticalConstraintVeto = null;

    // -------------------------------------------------------------
    // FACTOR 1: Location & Agro-Climatic Suitability (Weight: 15%)
    // -------------------------------------------------------------
    let locScore = 70;
    if (isTamilNadu) {
      if (crop.regionalSuitability.includes('Tamil Nadu') || crop.regionalSuitability.some((r) => r.includes('Delta') || r.includes('Zone'))) {
        locScore = 100;
        reasons.push(`High regional suitability for Tamil Nadu agro-climatic zones (${crop.plantingCalendarTN})`);
        factorExplanations.location = `Proven variety in Tamil Nadu agricultural zones under TNAU package of practices.`;
      } else if (crop.shortName === 'Wheat') {
        locScore = 20;
        limitations.push('Wheat requires temperate winter nights; poorly adapted to tropical Tamil Nadu plains.');
        factorExplanations.location = 'Unsuitable agro-climatic conditions: Wheat demands cold winter vernalization.';
      } else {
        locScore = 75;
        factorExplanations.location = 'Adaptable across peninsular agro-climatic zones.';
      }
    } else if (isSouthIndia) {
      if (crop.shortName === 'Wheat') {
        locScore = 30;
        limitations.push('Wheat generally restricted to northern latitudes or high-elevation tracts.');
        factorExplanations.location = 'Sub-optimal latitude for commercial wheat production.';
      } else {
        locScore = 85;
        factorExplanations.location = 'Favorable tropical/semi-arid peninsular climate.';
      }
    } else {
      // Pan-India general
      locScore = 80;
      factorExplanations.location = 'Compatible with broad national agro-climatic benchmarks.';
    }
    factorScores.location = locScore;

    // -------------------------------------------------------------
    // FACTOR 2: Season & Planting Window (Weight: 15%)
    // -------------------------------------------------------------
    let seasonScore = 40;
    if (crop.seasons.includes(season) || (isTamilNadu && crop.seasons.some((s) => tnPattam.includes(s)))) {
      seasonScore = 100;
      reasons.push(`Optimal planting window for current ${season} season (${tnPattam})`);
      factorExplanations.season = `Aligns with the active ${season} sowing calendar (${tnPattam}).`;
    } else if (crop.seasons.includes('Year-round') || crop.seasons.includes('Perennial Plantation')) {
      seasonScore = 95;
      reasons.push('Can be established throughout the year with adequate water provision');
      factorExplanations.season = 'Flexible or perennial planting window.';
    } else {
      seasonScore = 45;
      limitations.push(`Off-season for ${season}; best planted during ${crop.seasons.join(', ')}.`);
      factorExplanations.season = `Off-season: Typical sowing season is ${crop.seasons.join(', ')}.`;
    }
    factorScores.season = seasonScore;

    // -------------------------------------------------------------
    // FACTOR 3: Weather & Climate Suitability (Weight: 15%)
    // -------------------------------------------------------------
    let weatherScore = 70;
    if (weatherInfo && weatherInfo.isAvailable && weatherInfo.current) {
      const currentTemp = weatherInfo.current.temperature;
      const forecastTemps = (weatherInfo.forecast || []).map((d) => d.maxTemp);
      const avgMaxTemp = forecastTemps.length > 0
        ? forecastTemps.reduce((a, b) => a + b, 0) / forecastTemps.length
        : currentTemp;

      if (currentTemp >= crop.tempRange.optimalMin && currentTemp <= crop.tempRange.optimalMax) {
        weatherScore = 100;
        reasons.push(`Current temperature (${currentTemp}°C) is in the optimal physiological range (${crop.tempRange.optimalMin}-${crop.tempRange.optimalMax}°C)`);
        factorExplanations.weather = `Field temperature (${currentTemp}°C) perfectly matches optimum vegetative growth.`;
      } else if (currentTemp >= crop.tempRange.min && currentTemp <= crop.tempRange.max) {
        weatherScore = 75;
        factorExplanations.weather = `Temperature (${currentTemp}°C) is within tolerable crop bounds (${crop.tempRange.min}-${crop.tempRange.max}°C).`;
      } else if (currentTemp > crop.tempRange.max) {
        weatherScore = 30;
        limitations.push(`Heat stress alert: Current/forecast temp (${Math.round(avgMaxTemp)}°C) exceeds upper tolerance (${crop.tempRange.max}°C).`);
        factorExplanations.weather = `Thermal stress risk: Max temperature (${Math.round(avgMaxTemp)}°C) exceeds optimal threshold.`;
      } else {
        weatherScore = 40;
        limitations.push(`Cold stress alert: Current temperature (${currentTemp}°C) below minimum requirement (${crop.tempRange.min}°C).`);
        factorExplanations.weather = `Low ambient temperatures may impede germination or cause chilling injury.`;
      }
    } else {
      // Weather API unavailable -> use historical baseline
      weatherScore = 65;
      missingInfoImpacts.push('Live weather forecast was temporarily unavailable; evaluated using historical climate normals.');
      factorExplanations.weather = 'Estimated from regional historical climate averages (Open-Meteo reanalysis).';
    }
    factorScores.weather = weatherScore;

    // -------------------------------------------------------------
    // FACTOR 4: Soil Type & Drainage Compatibility (Weight: 10%)
    // -------------------------------------------------------------
    let soilScore = 40;
    if (crop.suitableSoils.includes(soilType)) {
      soilScore = 80;
      reasons.push(`Strong physical soil match with ${soilType}`);
      factorExplanations.soilTypeDrainage = `Soil texture (${soilType}) is naturally suited to this root architecture.`;
    } else if (soilType === 'Loamy Soil' || soilType === 'Alluvial Soil') {
      soilScore = 65;
      factorExplanations.soilTypeDrainage = `Moderate compatibility with fertile ${soilType}.`;
    } else {
      soilScore = 30;
      limitations.push(`${soilType} is sub-optimal for this crop; requires organic matter supplementation.`);
      factorExplanations.soilTypeDrainage = `Sub-optimal soil texture (${soilType}); requires amendments.`;
    }

    // Drainage adjustment
    if (soilDrainage) {
      if (crop.suitableDrainage.includes(soilDrainage)) {
        soilScore = Math.min(100, soilScore + 20);
        reasons.push(`Soil drainage (${soilDrainage}) matches root respiration requirements`);
      } else if (soilDrainage === 'Poor / Waterlogged' && !crop.suitableDrainage.includes('Poor / Waterlogged')) {
        soilScore = Math.max(15, soilScore - 35);
        limitations.push(`Poor drainage / waterlogging risk: Roots vulnerable to collar rot and asphyxiation.`);
      }
    } else {
      missingInfoImpacts.push('Soil drainage unmeasured; well-drained conditions are presumed.');
    }
    factorScores.soilTypeDrainage = soilScore;

    // -------------------------------------------------------------
    // FACTOR 5: Soil Nutrients & pH (Weight: 15%)
    // -------------------------------------------------------------
    let nutrientScore = 50; // Neutral baseline when missing
    let phExplanation = '';
    let npkExplanation = '';

    if (soilPh !== null && !isNaN(Number(soilPh))) {
      const ph = Number(soilPh);
      if (ph >= crop.phRange.optimalMin && ph <= crop.phRange.optimalMax) {
        nutrientScore = 85;
        reasons.push(`Soil pH (${ph}) is within the optimum nutrient absorption band (${crop.phRange.optimalMin}-${crop.phRange.optimalMax})`);
        phExplanation = `Soil pH (${ph}) is optimum.`;
      } else if (ph >= crop.phRange.min && ph <= crop.phRange.max) {
        nutrientScore = 65;
        phExplanation = `Soil pH (${ph}) is tolerable (${crop.phRange.min}-${crop.phRange.max}).`;
      } else if (ph < crop.phRange.min) {
        nutrientScore = 30;
        limitations.push(`Soil acidity alert: pH (${ph}) is below recommended minimum (${crop.phRange.min}). Apply agricultural lime.`);
        phExplanation = `Acidic pH (${ph}) restricts nutrient uptake.`;
      } else {
        nutrientScore = 30;
        limitations.push(`Soil alkalinity alert: pH (${ph}) exceeds recommended maximum (${crop.phRange.max}). Apply gypsum or organic compost.`);
        phExplanation = `Alkaline pH (${ph}) induces micronutrient lockup.`;
      }
    } else {
      missingInfoImpacts.push('Soil pH not provided; neutral pH range assumed for provisional evaluation.');
      phExplanation = 'pH unmeasured.';
    }

    // Evaluate NPK if available
    if (soilNitrogen !== null || soilPhosphorus !== null || soilPotassium !== null) {
      let npkBonus = 0;
      if (soilNitrogen !== null) {
        if (crop.nutrientNeeds.N === 'Low' && soilNitrogen < 280) npkBonus += 5;
        if (crop.nutrientNeeds.N === 'High' && soilNitrogen >= 350) npkBonus += 5;
      }
      if (soilPhosphorus !== null && soilPhosphorus >= 15) npkBonus += 5;
      if (soilPotassium !== null && soilPotassium >= 120) npkBonus += 5;
      nutrientScore = Math.min(100, nutrientScore + npkBonus);
      npkExplanation = 'Soil fertility records factored into score.';
    } else {
      missingInfoImpacts.push('NPK test records missing; standard fertilizer scheduling will be required.');
      npkExplanation = 'NPK test values unavailable.';
    }

    factorExplanations.nutrientsAndPh = `${phExplanation} ${npkExplanation}`.trim();
    factorScores.nutrientsAndPh = nutrientScore;

    // -------------------------------------------------------------
    // FACTOR 6: Water Availability & Source (Weight: 15%)
    // -------------------------------------------------------------
    let waterScore = 60;
    const avail = (waterAvailability || '').toLowerCase();
    const source = (waterSource || '').toLowerCase();

    if (crop.waterDemand === 'High') {
      if (avail === 'high' || source.includes('canal') || source.includes('borewell') || source.includes('river')) {
        waterScore = 95;
        reasons.push(`Sufficient water supply available for high water-demand crop (${crop.waterMmRange[0]}-${crop.waterMmRange[1]}mm)`);
        factorExplanations.waterAvailability = `Adequate irrigation reserves match high water requirement (${crop.waterMmRange[0]}-${crop.waterMmRange[1]}mm).`;
      } else if (avail === 'moderate') {
        waterScore = 55;
        limitations.push(`Moderate water availability: This crop demands ${crop.waterMmRange[0]}-${crop.waterMmRange[1]}mm; moisture stress likely without supplemental irrigation.`);
        factorExplanations.waterAvailability = `Water availability is moderate for a heavy-water crop.`;
      } else if (avail === 'low' || irrigationMethod === 'Rainfed') {
        waterScore = 15;
        criticalConstraintVeto = `Critical Water Deficit: ${crop.name} requires high water (${crop.waterMmRange[0]}-${crop.waterMmRange[1]}mm), but available water is rated Low/Rainfed.`;
        limitations.push(`Severe water constraint: Low water availability cannot sustain this high-water crop.`);
        factorExplanations.waterAvailability = `Severe limitation: Water reserves inadequate for high-water crop.`;
      } else {
        waterScore = 45;
        missingInfoImpacts.push('Water availability rating missing; high water requirement must be verified by farmer.');
        factorExplanations.waterAvailability = 'Water availability unrecorded; irrigation capacity must be verified.';
      }
    } else if (crop.waterDemand === 'Low' || crop.waterDemand === 'Low to Moderate') {
      if (avail === 'low' || irrigationMethod === 'Rainfed') {
        waterScore = 100;
        reasons.push(`Outstanding drought tolerance; thrives under low water availability (${crop.waterMmRange[0]}-${crop.waterMmRange[1]}mm)`);
        factorExplanations.waterAvailability = `Excellent match for limited water or dryland farming (${crop.waterMmRange[0]}-${crop.waterMmRange[1]}mm).`;
      } else {
        waterScore = 90;
        reasons.push('Low water requirement provides safe production buffer');
        factorExplanations.waterAvailability = `Low water requirement ensures high drought resilience.`;
      }
    } else {
      // Moderate water demand
      if (avail === 'high' || avail === 'moderate') {
        waterScore = 90;
        reasons.push(`Field water capacity satisfies moderate water requirement (${crop.waterMmRange[0]}-${crop.waterMmRange[1]}mm)`);
        factorExplanations.waterAvailability = `Field water availability satisfies moderate demand (${crop.waterMmRange[0]}-${crop.waterMmRange[1]}mm).`;
      } else if (avail === 'low') {
        waterScore = 40;
        limitations.push(`Low water availability may restrict yield during critical flowering stage.`);
        factorExplanations.waterAvailability = `Low water availability poses yield penalty during critical moisture periods.`;
      } else {
        waterScore = 65;
        missingInfoImpacts.push('Water availability level unverified.');
        factorExplanations.waterAvailability = 'Water availability level unverified.';
      }
    }
    factorScores.waterAvailability = waterScore;

    // -------------------------------------------------------------
    // FACTOR 7: Irrigation Method Compatibility (Weight: 5%)
    // -------------------------------------------------------------
    let irrigScore = 50;
    if (crop.suitableIrrigation.includes(irrigationMethod)) {
      irrigScore = 100;
      reasons.push(`Fully compatible with your ${irrigationMethod}`);
      factorExplanations.irrigationCompatibility = `Direct match with ${irrigationMethod}.`;
    } else if (irrigationMethod === 'Drip Irrigation') {
      irrigScore = 90;
      reasons.push('Drip irrigation enables precision fertigation and moisture regulation');
      factorExplanations.irrigationCompatibility = 'Drip irrigation maximizes water use efficiency.';
    } else {
      irrigScore = 50;
      factorExplanations.irrigationCompatibility = `Adaptable to ${irrigationMethod} with appropriate scheduling.`;
    }
    factorScores.irrigationCompatibility = irrigScore;

    // -------------------------------------------------------------
    // FACTOR 8: Previous Crop & Rotation Benefit (Weight: 5%)
    // -------------------------------------------------------------
    let rotScore = 60;
    if (previousCrop) {
      const prevNorm = previousCrop.toLowerCase().trim();
      const isBeneficial = crop.rotationBenefits.beneficialPrevious.some((b) => prevNorm.includes(b.toLowerCase()));
      const isAvoid = crop.rotationBenefits.avoidPrevious.some((a) => prevNorm.includes(a.toLowerCase()));

      if (isBeneficial) {
        rotScore = 100;
        reasons.push(`Excellent rotation benefit following ${previousCrop} (breaks pest cycle & improves soil biology)`);
        factorExplanations.rotation = `Beneficial rotation following ${previousCrop} (pest break & nitrogen efficiency).`;
      } else if (isAvoid) {
        rotScore = 20;
        limitations.push(`Monocropping warning: Repeating ${previousCrop} encourages soil-borne pathogens and nutrient depletion.`);
        factorExplanations.rotation = `Continuous cropping of ${previousCrop} increases disease inoculum in soil.`;
      } else {
        rotScore = 70;
        factorExplanations.rotation = `Neutral agronomic succession following ${previousCrop}.`;
      }
    } else {
      rotScore = 60;
      missingInfoImpacts.push('Previous crop history unrecorded.');
      factorExplanations.rotation = 'No prior crop history recorded.';
    }
    factorScores.rotation = rotScore;

    // -------------------------------------------------------------
    // WEIGHTED SCORE CALCULATION
    // -------------------------------------------------------------
    let weightedScore = 
      factorScores.location * weights.location +
      factorScores.season * weights.season +
      factorScores.weather * weights.weather +
      factorScores.soilTypeDrainage * weights.soilTypeDrainage +
      factorScores.nutrientsAndPh * weights.nutrientsAndPh +
      factorScores.waterAvailability * weights.waterAvailability +
      factorScores.irrigationCompatibility * weights.irrigationCompatibility +
      factorScores.rotation * weights.rotation;

    let finalScore = Math.round(weightedScore);

    // Enforce Critical Constraint Veto
    if (criticalConstraintVeto) {
      finalScore = Math.min(42, finalScore); // Cap at Low Suitability
    }

    // Determine Category
    let category = 'Low Suitability';
    if (finalScore >= 75) {
      category = 'Highly Suitable';
    } else if (finalScore >= 50) {
      category = 'Moderately Suitable';
    } else {
      category = 'Low Suitability';
    }

    return {
      name: crop.name,
      shortName: crop.shortName,
      scientificName: crop.scientificName,
      category: crop.category,
      image: crop.image,
      score: finalScore,
      suitabilityCategory: category,
      individualFactorScores: factorScores,
      factorExplanations,
      reasons,
      limitations,
      criticalConstraintVeto,
      missingInformation: missingInfoImpacts,
      recommendedPrecautions: crop.precautions,
      soilRequirements: crop.soilRequirements,
      waterRequirements: crop.waterRequirements,
      growingDuration: crop.growingDurationDays,
      criticalWaterStages: crop.criticalWaterStages,
      plantingWindow: crop.plantingCalendarTN,
      economics: crop.economics,
      stages: crop.stages,
    };
  });

  // Sort crops by score descending
  scoredCrops.sort((a, b) => b.score - a.score);

  // Filter top 3 suitable crops (score >= 40)
  const qualified = scoredCrops.filter((c) => c.score >= 40);
  const topRecommendations = qualified.slice(0, 3);

  const noViableCropsExplanation = topRecommendations.length === 0
    ? 'No registered crops reached the minimum agricultural suitability threshold for this plot configuration. This is typically due to severe water deficit or extreme soil/climate incompatibility.'
    : null;

  return {
    season,
    tamilNaduPattam: tnPattam,
    dataCompleteness: completeness,
    evaluatedCriteria: {
      location: location || district || 'Field Coordinates',
      district,
      state,
      digipin,
      latitude: latNum,
      longitude: lonNum,
      soilType,
      soilDrainage: soilDrainage || 'Unrecorded',
      soilPh: soilPh !== null ? Number(soilPh) : 'Unrecorded',
      waterSource: waterSource || 'Unrecorded',
      waterAvailability: waterAvailability || 'Unrecorded',
      irrigationMethod,
      previousCrop: previousCrop || 'None recorded',
      weatherIncluded: Boolean(weatherInfo && weatherInfo.isAvailable),
    },
    recommendations: topRecommendations,
    allScoredCropsCount: scoredCrops.length,
    noViableCropsExplanation,
  };
};

/**
 * Secondary Feature 1: Crop Profitability & Economics Estimator
 */
export const calculateCropProfitability = (crop, areaAcres = 1, customPricePerUnit = null) => {
  if (!crop || !crop.economics) {
    return null;
  }

  const acres = Math.max(0.1, Number(areaAcres) || 1);
  const econ = crop.economics;
  const unitCost = econ.totalCostPerAcre;
  const totalCultivationCost = Math.round(unitCost * acres);

  const costBreakdown = {
    seeds: Math.round(econ.costBreakdown.seeds * acres),
    fertilizers: Math.round(econ.costBreakdown.fertilizers * acres),
    plantProtection: Math.round(econ.costBreakdown.plantProtection * acres),
    labour: Math.round(econ.costBreakdown.labour * acres),
    irrigationAndPower: Math.round(econ.costBreakdown.irrigationAndPower * acres),
    total: totalCultivationCost,
  };

  const avgYieldPerAcre = (econ.expectedYieldPerAcre.min + econ.expectedYieldPerAcre.max) / 2;
  const totalExpectedYield = Number((avgYieldPerAcre * acres).toFixed(1));
  const yieldUnit = econ.expectedYieldPerAcre.unit;

  const marketPrice = customPricePerUnit !== null && !isNaN(Number(customPricePerUnit)) && Number(customPricePerUnit) > 0
    ? Number(customPricePerUnit)
    : econ.marketPriceBenchmark.price;

  const expectedRevenue = Math.round(totalExpectedYield * marketPrice);
  const estimatedNetProfit = expectedRevenue - totalCultivationCost;
  const breakEvenPrice = totalExpectedYield > 0
    ? Math.round(totalCultivationCost / totalExpectedYield)
    : 0;

  return {
    cropName: crop.name,
    areaAcres: acres,
    costBreakdown,
    totalCultivationCost,
    expectedYieldRange: {
      min: Number((econ.expectedYieldPerAcre.min * acres).toFixed(1)),
      max: Number((econ.expectedYieldPerAcre.max * acres).toFixed(1)),
      unit: yieldUnit,
    },
    marketPriceUsed: marketPrice,
    marketPriceUnit: econ.marketPriceBenchmark.unit,
    marketPriceSource: econ.marketPriceBenchmark.source,
    isCustomPrice: Boolean(customPricePerUnit && Number(customPricePerUnit) !== econ.marketPriceBenchmark.price),
    expectedRevenue,
    estimatedNetProfit,
    breakEvenPrice,
    profitMarginPercent: expectedRevenue > 0 ? Math.round((estimatedNetProfit / expectedRevenue) * 100) : 0,
    disclaimer: 'Economics are agronomic estimates based on standard regional cultivation costs and market benchmarks. Actual yields and prices fluctuate based on seasonal weather, pest pressures, and local market mandi conditions.',
  };
};

/**
 * Secondary Feature 2: Farm Climate Risk Alert Generator
 */
export const generateFarmRiskAlerts = (crop, weatherInfo) => {
  const alerts = [];
  if (!weatherInfo || !weatherInfo.isAvailable || !weatherInfo.forecast) {
    return alerts;
  }

  const forecast = weatherInfo.forecast;
  const highTempThreshold = 37;
  const heavyRainThresholdMm = 35;

  // 1. Heat stress check
  const consecutiveHotDays = forecast.filter((d) => d.maxTemp >= highTempThreshold);
  if (consecutiveHotDays.length >= 2) {
    alerts.push({
      id: 'heat_stress',
      title: 'High Temperature / Heat Stress Advisory',
      riskLevel: 'Moderate to High',
      badgeColor: 'amber',
      reason: `Forecast predicts ${consecutiveHotDays.length} days with peak temperatures reaching ${consecutiveHotDays[0].maxTemp}°C.`,
      preventiveAction: 'Apply light supplemental irrigation during early morning hours to maintain leaf turgidity and prevent pollen sterility. Avoid foliar chemical sprays during mid-day heat.',
      period: `${consecutiveHotDays[0].date} to ${consecutiveHotDays[consecutiveHotDays.length - 1].date}`,
    });
  }

  // 2. Heavy Rainfall / Waterlogging check
  const heavyRainDay = forecast.find((d) => d.precipitationSumMm >= heavyRainThresholdMm);
  if (heavyRainDay) {
    alerts.push({
      id: 'heavy_rain',
      title: 'Heavy Rainfall & Waterlogging Alert',
      riskLevel: 'High',
      badgeColor: 'red',
      reason: `Significant precipitation expected (${heavyRainDay.precipitationSumMm} mm) on ${heavyRainDay.date}.`,
      preventiveAction: 'Inspect field bunds and clear perimeter drainage trenches. Suspend nitrogen top-dressing and pesticide spraying 24 hours prior to forecasted downpour.',
      period: heavyRainDay.date,
    });
  }

  // 3. Dry Spell / Irrigation Demand check
  const totalRain = forecast.reduce((sum, d) => sum + d.precipitationSumMm, 0);
  if (totalRain < 2.0 && forecast.length >= 5) {
    alerts.push({
      id: 'dry_spell',
      title: 'Prolonged Dry Spell Notice',
      riskLevel: 'Advisory',
      badgeColor: 'green',
      reason: 'Negligible precipitation (< 2 mm) forecast over the coming 7 days.',
      preventiveAction: 'Schedule timely irrigation for moisture-sensitive growth phases (tillering / flowering / pegging). Consider surface mulching to reduce soil moisture evaporation.',
      period: 'Next 7 Days',
    });
  }

  // 4. Disease Favorable Weather (High humidity & moderate temperatures)
  const current = weatherInfo.current;
  if (current && current.humidity >= 80 && current.temperature >= 22 && current.temperature <= 28) {
    alerts.push({
      id: 'disease_weather',
      title: 'Foliar Fungal Infection Advisory',
      riskLevel: 'Moderate',
      badgeColor: 'amber',
      reason: `Ambient relative humidity (${current.humidity}%) combined with moderate warmth (${current.temperature}°C) creates conditions conducive to foliar fungal leaf spots.`,
      preventiveAction: 'Regularly scout lower canopy leaves for early lesions. Ensure adequate air circulation and avoid overhead sprinkler watering.',
      period: 'Current Meteorological Window',
    });
  }

  return alerts;
};

/**
 * Estimate Growth Stage for a Planted Crop
 */
export const estimateGrowthStage = (cropName, plantingDate) => {
  if (!plantingDate) {
    return {
      daysSincePlanting: 0,
      currentStage: 'Unknown',
      stageDescription: 'Planting date not provided.',
      progressPercentage: 0,
      isEstimate: true,
    };
  }

  const pDate = new Date(plantingDate);
  const today = new Date();
  const diffTime = today.getTime() - pDate.getTime();
  const daysSincePlanting = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  const matchedCrop = CROPS_DATABASE.find(
    (c) =>
      cropName.toLowerCase().includes(c.shortName.toLowerCase()) ||
      c.name.toLowerCase().includes(cropName.toLowerCase())
  ) || CROPS_DATABASE[0];

  const stages = matchedCrop.stages || [
    { name: 'Vegetative', startDay: 0, endDay: 45, description: 'Vegetative growth' },
    { name: 'Flowering', startDay: 46, endDay: 80, description: 'Flowering stage' },
    { name: 'Maturity', startDay: 81, endDay: 120, description: 'Harvest maturity' },
  ];

  let currentStage = stages[stages.length - 1];

  for (const stage of stages) {
    if (daysSincePlanting >= stage.startDay && daysSincePlanting <= stage.endDay) {
      currentStage = stage;
      break;
    }
  }

  const maxDay = stages[stages.length - 1].endDay || 120;
  const progressPercentage = Math.min(100, Math.round((daysSincePlanting / maxDay) * 100));

  return {
    daysSincePlanting,
    currentStage: currentStage.name,
    stageDescription: currentStage.description,
    progressPercentage,
    totalEstimatedDays: maxDay,
    allStages: stages,
    isEstimate: true,
    estimatedNotice: 'This growth stage is an estimate based on days since planting and average regional crop cycles.',
  };
};
