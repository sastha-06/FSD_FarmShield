import { findFieldById } from '../services/dataStore.js';
import {
  getCropRecommendations,
  estimateGrowthStage,
  calculateCropProfitability,
  generateFarmRiskAlerts,
  CROPS_DATABASE,
  DEFAULT_FACTOR_WEIGHTS,
} from '../services/cropRules.js';
import { getLiveWeather } from '../services/weatherService.js';

export const recommendCrops = async (req, res) => {
  try {
    const {
      fieldId,
      soilType,
      soilDrainage,
      soilPh,
      soilNitrogen,
      soilPhosphorus,
      soilPotassium,
      waterSource,
      waterAvailability,
      irrigationMethod,
      irrigationFrequency,
      location,
      district,
      state,
      digipin,
      latitude,
      longitude,
      area,
      previousCrop,
      weights,
    } = req.body;

    let evalParams = {
      soilType,
      soilDrainage,
      soilPh,
      soilNitrogen,
      soilPhosphorus,
      soilPotassium,
      waterSource,
      waterAvailability,
      irrigationMethod,
      irrigationFrequency,
      location,
      district,
      state,
      digipin,
      latitude,
      longitude,
      area,
      previousCrop,
    };

    let field = null;
    if (fieldId) {
      field = await findFieldById(fieldId, req.farmer?._id);
      if (field) {
        evalParams = {
          soilType: field.soilType,
          soilDrainage: field.soilDrainage || '',
          soilPh: field.soilPh,
          soilNitrogen: field.soilNitrogen,
          soilPhosphorus: field.soilPhosphorus,
          soilPotassium: field.soilPotassium,
          waterSource: field.waterSource || '',
          waterAvailability: field.waterAvailability || '',
          irrigationMethod: field.irrigationMethod,
          irrigationFrequency: field.irrigationFrequency || '',
          location: field.location,
          district: field.district,
          state: field.state || '',
          digipin: field.digipin || '',
          latitude: field.latitude,
          longitude: field.longitude,
          area: field.area,
          previousCrop: field.previousCrop || '',
        };
      }
    }

    if (!evalParams.soilType || !evalParams.irrigationMethod) {
      return res.status(400).json({
        success: false,
        message: 'Soil type and irrigation method are required to generate recommendations.',
      });
    }

    // Fetch weather using exact field coordinates when available
    const weatherInfo = await getLiveWeather(
      evalParams.district || evalParams.location,
      evalParams.latitude,
      evalParams.longitude
    );

    const recommendationData = getCropRecommendations({
      ...evalParams,
      weatherInfo,
      weights: weights || DEFAULT_FACTOR_WEIGHTS,
    });

    // Attach profitability estimates and climate risk alerts for recommendations
    if (recommendationData.recommendations && recommendationData.recommendations.length > 0) {
      recommendationData.recommendations = recommendationData.recommendations.map((rec) => {
        const fullCrop = CROPS_DATABASE.find((c) => c.shortName === rec.shortName) || rec;
        const profitability = calculateCropProfitability(fullCrop, evalParams.area || 1);
        const riskAlerts = generateFarmRiskAlerts(fullCrop, weatherInfo);
        return {
          ...rec,
          profitability,
          riskAlerts,
        };
      });
    }

    return res.json({
      success: true,
      field: field ? { _id: field._id, fieldName: field.fieldName } : null,
      weather: weatherInfo,
      data: recommendationData,
    });
  } catch (error) {
    console.error('Error generating crop recommendations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate crop recommendations.',
    });
  }
};

export const getFieldCropDetails = async (req, res) => {
  try {
    const field = await findFieldById(req.params.fieldId, req.farmer._id);
    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Field not found or access denied.',
      });
    }

    // Live weather query with coordinates
    const weatherInfo = await getLiveWeather(
      field.district || field.location,
      field.latitude,
      field.longitude
    );

    if (!field.isCropPlanted) {
      // Unplanted: Multi-Factor Crop Recommendations
      const recommendationsData = getCropRecommendations({
        soilType: field.soilType,
        soilDrainage: field.soilDrainage || '',
        soilPh: field.soilPh,
        soilNitrogen: field.soilNitrogen,
        soilPhosphorus: field.soilPhosphorus,
        soilPotassium: field.soilPotassium,
        waterSource: field.waterSource || '',
        waterAvailability: field.waterAvailability || '',
        irrigationMethod: field.irrigationMethod,
        irrigationFrequency: field.irrigationFrequency || '',
        location: field.location,
        district: field.district,
        state: field.state || '',
        digipin: field.digipin || '',
        latitude: field.latitude,
        longitude: field.longitude,
        area: field.area,
        previousCrop: field.previousCrop || '',
        weatherInfo,
      });

      // Enrich top recommendations with profitability and risk alerts
      if (recommendationsData.recommendations && recommendationsData.recommendations.length > 0) {
        recommendationsData.recommendations = recommendationsData.recommendations.map((rec) => {
          const fullCrop = CROPS_DATABASE.find((c) => c.shortName === rec.shortName) || rec;
          const profitability = calculateCropProfitability(fullCrop, field.area || 1);
          const riskAlerts = generateFarmRiskAlerts(fullCrop, weatherInfo);
          return {
            ...rec,
            profitability,
            riskAlerts,
          };
        });
      }

      return res.json({
        success: true,
        isCropPlanted: false,
        field,
        weather: weatherInfo,
        recommendations: recommendationsData,
      });
    }

    // Planted Crop: Growth stage estimation + climate risk alerts
    const growthStage = estimateGrowthStage(field.cropName, field.plantingDate);
    const matchedCrop = CROPS_DATABASE.find(
      (c) =>
        c.shortName.toLowerCase() === field.cropName.toLowerCase() ||
        c.name.toLowerCase().includes(field.cropName.toLowerCase())
    );
    const riskAlerts = generateFarmRiskAlerts(matchedCrop || { name: field.cropName }, weatherInfo);
    const profitability = matchedCrop
      ? calculateCropProfitability(matchedCrop, field.area || 1)
      : null;

    return res.json({
      success: true,
      isCropPlanted: true,
      field,
      growthStage,
      weather: weatherInfo,
      riskAlerts,
      profitability,
    });
  } catch (error) {
    console.error('Error fetching crop details:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch field crop details.',
    });
  }
};

/**
 * Secondary Feature: Interactive Profitability Estimator API
 */
export const estimateProfitability = async (req, res) => {
  try {
    const { cropName, areaAcres, customPricePerUnit } = req.body;
    if (!cropName) {
      return res.status(400).json({
        success: false,
        message: 'Crop name is required to compute profitability estimate.',
      });
    }

    const matchedCrop = CROPS_DATABASE.find(
      (c) =>
        c.shortName.toLowerCase() === cropName.toLowerCase() ||
        c.name.toLowerCase().includes(cropName.toLowerCase())
    );

    if (!matchedCrop) {
      return res.status(404).json({
        success: false,
        message: `Crop "${cropName}" not found in economic registry.`,
      });
    }

    const estimate = calculateCropProfitability(matchedCrop, areaAcres || 1, customPricePerUnit);
    return res.json({
      success: true,
      data: estimate,
    });
  } catch (error) {
    console.error('Error calculating crop profitability:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate profitability estimation.',
    });
  }
};
