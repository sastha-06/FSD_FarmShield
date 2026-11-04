import {
  getFarmerStats,
  findFieldsByFarmerId,
  findAnalysesByFarmerId,
  findRecentAdvisoriesByFarmerId,
} from '../services/dataStore.js';
import { getCropRecommendations } from '../services/cropRules.js';

export const getDashboardOverview = async (req, res) => {
  try {
    const farmerId = req.farmer._id;

    // Fetch actual database stats
    const stats = await getFarmerStats(farmerId);

    // Fetch recent records
    const fields = await findFieldsByFarmerId(farmerId);
    const recentFields = fields.slice(0, 4);

    const analyses = await findAnalysesByFarmerId(farmerId);
    const recentAnalyses = analyses.slice(0, 4);

    const recentAdvisories = await findRecentAdvisoriesByFarmerId(farmerId, 3);

    // Dynamic crop recommendations for the farmer's region or unplanted field
    const unplantedField = fields.find((f) => !f.isCropPlanted);
    let sampleRecommendations = [];

    if (unplantedField) {
      const recResult = getCropRecommendations({
        soilType: unplantedField.soilType,
        irrigationMethod: unplantedField.irrigationMethod,
        location: unplantedField.location,
        district: unplantedField.district,
        area: unplantedField.area,
        previousCrop: unplantedField.previousCrop,
      });
      sampleRecommendations = recResult.recommendations;
    } else if (fields.length > 0) {
      const firstField = fields[0];
      const recResult = getCropRecommendations({
        soilType: firstField.soilType,
        irrigationMethod: firstField.irrigationMethod,
        location: firstField.location,
        district: firstField.district,
        area: firstField.area,
        previousCrop: firstField.cropName,
      });
      sampleRecommendations = recResult.recommendations;
    } else {
      // General regional recommendations for new farmers
      const general = getCropRecommendations({
        soilType: 'Loamy Soil',
        irrigationMethod: 'Drip Irrigation',
        location: 'Agricultural Zone',
      });
      sampleRecommendations = general.recommendations;
    }

    return res.json({
      success: true,
      stats,
      recentFields,
      recentAnalyses,
      recentAdvisories,
      sampleRecommendations,
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load dashboard overview data.',
    });
  }
};
