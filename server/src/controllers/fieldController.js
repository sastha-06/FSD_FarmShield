import {
  findFieldsByFarmerId,
  findFieldById,
  createField,
  updateField,
  deleteField,
} from '../services/dataStore.js';

export const getFields = async (req, res) => {
  try {
    const fields = await findFieldsByFarmerId(req.farmer._id);
    return res.json({
      success: true,
      count: fields.length,
      fields,
    });
  } catch (error) {
    console.error('Error fetching fields:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve agricultural fields.',
    });
  }
};

export const getField = async (req, res) => {
  try {
    const field = await findFieldById(req.params.id, req.farmer._id);
    if (!field) {
      return res.status(404).json({
        success: false,
        message: 'Field not found or access denied.',
      });
    }
    return res.json({
      success: true,
      field,
    });
  } catch (error) {
    console.error('Error fetching field:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve field details.',
    });
  }
};

export const addField = async (req, res) => {
  try {
    const {
      fieldName,
      location,
      district,
      village,
      area,
      areaUnit,
      soilType,
      irrigationMethod,
      previousCrop,
      isCropPlanted,
      cropName,
      cropVariety,
      plantingDate,
      fertilizers,
      digipin,
      latitude,
      longitude,
      state,
      pincode,
      locationSource,
      // Soil health & nutrients
      soilPh,
      soilNitrogen,
      soilPhosphorus,
      soilPotassium,
      organicCarbon,
      electricalConductivity,
      soilDrainage,
      zinc,
      iron,
      boron,
      soilTestDate,
      soilTestNotes,
      // Water availability & infrastructure
      waterSource,
      waterAvailability,
      seasonalAvailability,
      irrigationFrequency,
      estimatedWaterQuantity,
    } = req.body;

    if (!fieldName || !location || !district || !village || !area || !soilType || !irrigationMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required field parameters (Name, Location, District, Village, Area, Soil Type, Irrigation Method).',
      });
    }

    if (Number(area) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Field area must be greater than zero.',
      });
    }

    const isPlanted = Boolean(isCropPlanted);
    if (isPlanted && !cropName) {
      return res.status(400).json({
        success: false,
        message: 'Crop name is required when a crop is designated as currently planted.',
      });
    }

    const fieldData = {
      farmerId: req.farmer._id,
      fieldName: fieldName.trim(),
      location: location.trim(),
      district: district.trim(),
      village: village.trim(),
      area: Number(area),
      areaUnit: areaUnit || 'Acres',
      soilType,
      irrigationMethod,
      previousCrop: previousCrop ? previousCrop.trim() : '',
      isCropPlanted: isPlanted,
      cropName: isPlanted && cropName ? cropName.trim() : '',
      cropVariety: isPlanted && cropVariety ? cropVariety.trim() : '',
      plantingDate: isPlanted && plantingDate ? new Date(plantingDate) : null,
      digipin: digipin ? digipin.trim() : '',
      latitude: latitude !== undefined && latitude !== null && latitude !== '' ? Number(latitude) : null,
      longitude: longitude !== undefined && longitude !== null && longitude !== '' ? Number(longitude) : null,
      state: state ? state.trim() : '',
      pincode: pincode ? pincode.trim() : '',
      locationSource: locationSource || 'manual',
      // Soil health & nutrients
      soilPh: soilPh !== undefined && soilPh !== null && soilPh !== '' ? Number(soilPh) : null,
      soilNitrogen: soilNitrogen !== undefined && soilNitrogen !== null && soilNitrogen !== '' ? Number(soilNitrogen) : null,
      soilPhosphorus: soilPhosphorus !== undefined && soilPhosphorus !== null && soilPhosphorus !== '' ? Number(soilPhosphorus) : null,
      soilPotassium: soilPotassium !== undefined && soilPotassium !== null && soilPotassium !== '' ? Number(soilPotassium) : null,
      organicCarbon: organicCarbon !== undefined && organicCarbon !== null && organicCarbon !== '' ? Number(organicCarbon) : null,
      electricalConductivity: electricalConductivity !== undefined && electricalConductivity !== null && electricalConductivity !== '' ? Number(electricalConductivity) : null,
      soilDrainage: soilDrainage || '',
      zinc: zinc !== undefined && zinc !== null && zinc !== '' ? Number(zinc) : null,
      iron: iron !== undefined && iron !== null && iron !== '' ? Number(iron) : null,
      boron: boron !== undefined && boron !== null && boron !== '' ? Number(boron) : null,
      soilTestDate: soilTestDate ? new Date(soilTestDate) : null,
      soilTestNotes: soilTestNotes ? soilTestNotes.trim() : '',
      // Water availability & infrastructure
      waterSource: waterSource || '',
      waterAvailability: waterAvailability || '',
      seasonalAvailability: seasonalAvailability || '',
      irrigationFrequency: irrigationFrequency ? irrigationFrequency.trim() : '',
      estimatedWaterQuantity: estimatedWaterQuantity ? estimatedWaterQuantity.trim() : '',
    };

    const newField = await createField(fieldData, isPlanted && Array.isArray(fertilizers) ? fertilizers : []);

    return res.status(201).json({
      success: true,
      message: 'Agricultural field registered successfully!',
      field: newField,
    });
  } catch (error) {
    console.error('Error adding field:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to register new field.',
    });
  }
};

export const editField = async (req, res) => {
  try {
    const {
      fieldName,
      location,
      district,
      village,
      area,
      areaUnit,
      soilType,
      irrigationMethod,
      previousCrop,
      isCropPlanted,
      cropName,
      cropVariety,
      plantingDate,
      fertilizers,
      digipin,
      latitude,
      longitude,
      state,
      pincode,
      locationSource,
      // Soil health & nutrients
      soilPh,
      soilNitrogen,
      soilPhosphorus,
      soilPotassium,
      organicCarbon,
      electricalConductivity,
      soilDrainage,
      zinc,
      iron,
      boron,
      soilTestDate,
      soilTestNotes,
      // Water availability & infrastructure
      waterSource,
      waterAvailability,
      seasonalAvailability,
      irrigationFrequency,
      estimatedWaterQuantity,
    } = req.body;

    const existing = await findFieldById(req.params.id, req.farmer._id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Field not found or access denied.',
      });
    }

    const isPlanted = Boolean(isCropPlanted);
    const updateData = {
      fieldName: fieldName !== undefined ? fieldName.trim() : existing.fieldName,
      location: location !== undefined ? location.trim() : existing.location,
      district: district !== undefined ? district.trim() : existing.district,
      village: village !== undefined ? village.trim() : existing.village,
      area: area !== undefined ? Number(area) : existing.area,
      areaUnit: areaUnit || existing.areaUnit,
      soilType: soilType || existing.soilType,
      irrigationMethod: irrigationMethod || existing.irrigationMethod,
      previousCrop: previousCrop !== undefined ? previousCrop.trim() : existing.previousCrop,
      isCropPlanted: isPlanted,
      cropName: isPlanted ? (cropName ? cropName.trim() : existing.cropName) : '',
      cropVariety: isPlanted ? (cropVariety ? cropVariety.trim() : '') : '',
      plantingDate: isPlanted ? (plantingDate ? new Date(plantingDate) : existing.plantingDate) : null,
      digipin: digipin !== undefined ? (digipin ? digipin.trim() : '') : existing.digipin,
      latitude: latitude !== undefined ? (latitude !== null && latitude !== '' ? Number(latitude) : null) : existing.latitude,
      longitude: longitude !== undefined ? (longitude !== null && longitude !== '' ? Number(longitude) : null) : existing.longitude,
      state: state !== undefined ? (state ? state.trim() : '') : existing.state,
      pincode: pincode !== undefined ? (pincode ? pincode.trim() : '') : existing.pincode,
      locationSource: locationSource !== undefined ? locationSource : existing.locationSource,
      // Soil health & nutrients (preserve if undefined)
      soilPh: soilPh !== undefined ? (soilPh !== null && soilPh !== '' ? Number(soilPh) : null) : existing.soilPh,
      soilNitrogen: soilNitrogen !== undefined ? (soilNitrogen !== null && soilNitrogen !== '' ? Number(soilNitrogen) : null) : existing.soilNitrogen,
      soilPhosphorus: soilPhosphorus !== undefined ? (soilPhosphorus !== null && soilPhosphorus !== '' ? Number(soilPhosphorus) : null) : existing.soilPhosphorus,
      soilPotassium: soilPotassium !== undefined ? (soilPotassium !== null && soilPotassium !== '' ? Number(soilPotassium) : null) : existing.soilPotassium,
      organicCarbon: organicCarbon !== undefined ? (organicCarbon !== null && organicCarbon !== '' ? Number(organicCarbon) : null) : existing.organicCarbon,
      electricalConductivity: electricalConductivity !== undefined ? (electricalConductivity !== null && electricalConductivity !== '' ? Number(electricalConductivity) : null) : existing.electricalConductivity,
      soilDrainage: soilDrainage !== undefined ? soilDrainage : existing.soilDrainage,
      zinc: zinc !== undefined ? (zinc !== null && zinc !== '' ? Number(zinc) : null) : existing.zinc,
      iron: iron !== undefined ? (iron !== null && iron !== '' ? Number(iron) : null) : existing.iron,
      boron: boron !== undefined ? (boron !== null && boron !== '' ? Number(boron) : null) : existing.boron,
      soilTestDate: soilTestDate !== undefined ? (soilTestDate ? new Date(soilTestDate) : null) : existing.soilTestDate,
      soilTestNotes: soilTestNotes !== undefined ? (soilTestNotes ? soilTestNotes.trim() : '') : existing.soilTestNotes,
      // Water availability & infrastructure
      waterSource: waterSource !== undefined ? waterSource : existing.waterSource,
      waterAvailability: waterAvailability !== undefined ? waterAvailability : existing.waterAvailability,
      seasonalAvailability: seasonalAvailability !== undefined ? seasonalAvailability : existing.seasonalAvailability,
      irrigationFrequency: irrigationFrequency !== undefined ? (irrigationFrequency ? irrigationFrequency.trim() : '') : existing.irrigationFrequency,
      estimatedWaterQuantity: estimatedWaterQuantity !== undefined ? (estimatedWaterQuantity ? estimatedWaterQuantity.trim() : '') : existing.estimatedWaterQuantity,
    };

    const updated = await updateField(
      req.params.id,
      req.farmer._id,
      updateData,
      isPlanted && Array.isArray(fertilizers) ? fertilizers : []
    );

    return res.json({
      success: true,
      message: 'Field details updated successfully.',
      field: updated,
    });
  } catch (error) {
    console.error('Error updating field:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update field.',
    });
  }
};

export const removeField = async (req, res) => {
  try {
    const success = await deleteField(req.params.id, req.farmer._id);
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Field not found or could not be deleted.',
      });
    }
    return res.json({
      success: true,
      message: 'Field deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting field:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete field.',
    });
  }
};
