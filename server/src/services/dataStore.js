import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { Farmer } from '../models/Farmer.js';
import { Field } from '../models/Field.js';
import { FertilizerRecord } from '../models/FertilizerRecord.js';
import { DiseaseAnalysis } from '../models/DiseaseAnalysis.js';
import { Advisory } from '../models/Advisory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../data/db.json');

// Initialize local JSON storage if not exists
const defaultData = {
  farmers: [],
  fields: [],
  fertilizers: [],
  analyses: [],
  advisories: [],
};

const getLocalData = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local JSON db:', err);
    return defaultData;
  }
};

const saveLocalData = (data) => {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local JSON db:', err);
  }
};

const generateId = () => new mongoose.Types.ObjectId().toString();

const isConnected = () => mongoose.connection.readyState === 1;

// ================= FARMER OPERATIONS =================
export const findFarmerByEmail = async (email) => {
  const normEmail = email.toLowerCase().trim();
  if (isConnected()) {
    return await Farmer.findOne({ email: normEmail });
  }
  const data = getLocalData();
  return data.farmers.find((f) => f.email.toLowerCase() === normEmail) || null;
};

export const findFarmerById = async (id) => {
  const strId = id.toString();
  if (isConnected()) {
    return await Farmer.findById(strId).select('-passwordHash');
  }
  const data = getLocalData();
  const found = data.farmers.find((f) => f._id.toString() === strId);
  if (!found) return null;
  const { passwordHash, ...rest } = found;
  return rest;
};

export const findFarmerByIdWithPassword = async (id) => {
  const strId = id.toString();
  if (isConnected()) {
    return await Farmer.findById(strId);
  }
  const data = getLocalData();
  return data.farmers.find((f) => f._id.toString() === strId) || null;
};

export const createFarmer = async ({ name, email, passwordHash, phone }) => {
  const normEmail = email.toLowerCase().trim();
  if (isConnected()) {
    return await Farmer.create({ name, email: normEmail, passwordHash, phone });
  }
  const data = getLocalData();
  const newFarmer = {
    _id: generateId(),
    name,
    email: normEmail,
    passwordHash,
    phone: phone || '',
    createdAt: new Date().toISOString(),
  };
  data.farmers.push(newFarmer);
  saveLocalData(data);
  return newFarmer;
};

export const updateFarmer = async (id, updates) => {
  const strId = id.toString();
  if (isConnected()) {
    return await Farmer.findByIdAndUpdate(strId, updates, { new: true }).select('-passwordHash');
  }
  const data = getLocalData();
  const index = data.farmers.findIndex((f) => f._id.toString() === strId);
  if (index === -1) return null;
  data.farmers[index] = { ...data.farmers[index], ...updates };
  saveLocalData(data);
  const { passwordHash, ...rest } = data.farmers[index];
  return rest;
};

// ================= FIELD OPERATIONS =================
export const findFieldsByFarmerId = async (farmerId) => {
  const strFarmerId = farmerId.toString();
  if (isConnected()) {
    const fields = await Field.find({ farmerId: strFarmerId }).sort({ createdAt: -1 }).lean();
    for (const f of fields) {
      f.fertilizers = await FertilizerRecord.find({ fieldId: f._id }).sort({ applicationDate: -1 });
    }
    return fields;
  }
  const data = getLocalData();
  const fields = data.fields
    .filter((f) => f.farmerId.toString() === strFarmerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return fields.map((f) => ({
    ...f,
    fertilizers: (data.fertilizers || [])
      .filter((fr) => fr.fieldId.toString() === f._id.toString())
      .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate)),
  }));
};

export const findFieldById = async (fieldId, farmerId = null) => {
  const strFieldId = fieldId.toString();
  if (isConnected()) {
    const query = { _id: strFieldId };
    if (farmerId) query.farmerId = farmerId.toString();
    const field = await Field.findOne(query).lean();
    if (!field) return null;
    field.fertilizers = await FertilizerRecord.find({ fieldId: strFieldId }).sort({ applicationDate: -1 });
    return field;
  }
  const data = getLocalData();
  const field = data.fields.find(
    (f) =>
      f._id.toString() === strFieldId &&
      (!farmerId || f.farmerId.toString() === farmerId.toString())
  );
  if (!field) return null;
  return {
    ...field,
    fertilizers: (data.fertilizers || [])
      .filter((fr) => fr.fieldId.toString() === strFieldId)
      .sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate)),
  };
};

export const createField = async (fieldData, fertilizerRecords = []) => {
  if (isConnected()) {
    const field = await Field.create(fieldData);
    if (fertilizerRecords && fertilizerRecords.length > 0) {
      const recordsToInsert = fertilizerRecords.map((r) => ({
        fieldId: field._id,
        fertilizerName: r.fertilizerName,
        applicationDate: r.applicationDate || new Date(),
      }));
      await FertilizerRecord.insertMany(recordsToInsert);
    }
    return await findFieldById(field._id);
  }
  const data = getLocalData();
  const newField = {
    _id: generateId(),
    farmerId: fieldData.farmerId.toString(),
    fieldName: fieldData.fieldName,
    location: fieldData.location,
    district: fieldData.district,
    village: fieldData.village,
    area: Number(fieldData.area),
    areaUnit: fieldData.areaUnit || 'Acres',
    soilType: fieldData.soilType,
    irrigationMethod: fieldData.irrigationMethod,
    previousCrop: fieldData.previousCrop || '',
    isCropPlanted: Boolean(fieldData.isCropPlanted),
    cropName: fieldData.cropName || '',
    cropVariety: fieldData.cropVariety || '',
    plantingDate: fieldData.plantingDate || null,
    digipin: fieldData.digipin || '',
    latitude: fieldData.latitude !== undefined && fieldData.latitude !== null ? Number(fieldData.latitude) : null,
    longitude: fieldData.longitude !== undefined && fieldData.longitude !== null ? Number(fieldData.longitude) : null,
    state: fieldData.state || '',
    pincode: fieldData.pincode || '',
    locationSource: fieldData.locationSource || 'manual',
    // Soil health & nutrients
    soilPh: fieldData.soilPh !== undefined && fieldData.soilPh !== null && fieldData.soilPh !== '' ? Number(fieldData.soilPh) : null,
    soilNitrogen: fieldData.soilNitrogen !== undefined && fieldData.soilNitrogen !== null && fieldData.soilNitrogen !== '' ? Number(fieldData.soilNitrogen) : null,
    soilPhosphorus: fieldData.soilPhosphorus !== undefined && fieldData.soilPhosphorus !== null && fieldData.soilPhosphorus !== '' ? Number(fieldData.soilPhosphorus) : null,
    soilPotassium: fieldData.soilPotassium !== undefined && fieldData.soilPotassium !== null && fieldData.soilPotassium !== '' ? Number(fieldData.soilPotassium) : null,
    organicCarbon: fieldData.organicCarbon !== undefined && fieldData.organicCarbon !== null && fieldData.organicCarbon !== '' ? Number(fieldData.organicCarbon) : null,
    electricalConductivity: fieldData.electricalConductivity !== undefined && fieldData.electricalConductivity !== null && fieldData.electricalConductivity !== '' ? Number(fieldData.electricalConductivity) : null,
    soilDrainage: fieldData.soilDrainage || '',
    zinc: fieldData.zinc !== undefined && fieldData.zinc !== null && fieldData.zinc !== '' ? Number(fieldData.zinc) : null,
    iron: fieldData.iron !== undefined && fieldData.iron !== null && fieldData.iron !== '' ? Number(fieldData.iron) : null,
    boron: fieldData.boron !== undefined && fieldData.boron !== null && fieldData.boron !== '' ? Number(fieldData.boron) : null,
    soilTestDate: fieldData.soilTestDate || null,
    soilTestNotes: fieldData.soilTestNotes || '',
    // Water availability & infrastructure
    waterSource: fieldData.waterSource || '',
    waterAvailability: fieldData.waterAvailability || '',
    seasonalAvailability: fieldData.seasonalAvailability || '',
    irrigationFrequency: fieldData.irrigationFrequency || '',
    estimatedWaterQuantity: fieldData.estimatedWaterQuantity || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.fields.push(newField);

  if (fertilizerRecords && fertilizerRecords.length > 0) {
    if (!data.fertilizers) data.fertilizers = [];
    fertilizerRecords.forEach((r) => {
      data.fertilizers.push({
        _id: generateId(),
        fieldId: newField._id,
        fertilizerName: r.fertilizerName,
        applicationDate: r.applicationDate || new Date().toISOString(),
      });
    });
  }

  saveLocalData(data);
  return await findFieldById(newField._id);
};

export const updateField = async (fieldId, farmerId, updateData, fertilizerRecords = null) => {
  const strFieldId = fieldId.toString();
  const strFarmerId = farmerId.toString();

  if (isConnected()) {
    const field = await Field.findOneAndUpdate(
      { _id: strFieldId, farmerId: strFarmerId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    if (!field) return null;

    if (fertilizerRecords !== null) {
      await FertilizerRecord.deleteMany({ fieldId: strFieldId });
      if (fertilizerRecords.length > 0) {
        await FertilizerRecord.insertMany(
          fertilizerRecords.map((r) => ({
            fieldId: strFieldId,
            fertilizerName: r.fertilizerName,
            applicationDate: r.applicationDate || new Date(),
          }))
        );
      }
    }
    return await findFieldById(strFieldId);
  }

  const data = getLocalData();
  const index = data.fields.findIndex(
    (f) => f._id.toString() === strFieldId && f.farmerId.toString() === strFarmerId
  );
  if (index === -1) return null;

  data.fields[index] = {
    ...data.fields[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
  };

  if (fertilizerRecords !== null) {
    data.fertilizers = (data.fertilizers || []).filter(
      (fr) => fr.fieldId.toString() !== strFieldId
    );
    fertilizerRecords.forEach((r) => {
      data.fertilizers.push({
        _id: generateId(),
        fieldId: strFieldId,
        fertilizerName: r.fertilizerName,
        applicationDate: r.applicationDate || new Date().toISOString(),
      });
    });
  }

  saveLocalData(data);
  return await findFieldById(strFieldId);
};

export const deleteField = async (fieldId, farmerId) => {
  const strFieldId = fieldId.toString();
  const strFarmerId = farmerId.toString();

  if (isConnected()) {
    const field = await Field.findOneAndDelete({ _id: strFieldId, farmerId: strFarmerId });
    if (!field) return false;
    await FertilizerRecord.deleteMany({ fieldId: strFieldId });
    return true;
  }

  const data = getLocalData();
  const beforeCount = data.fields.length;
  data.fields = data.fields.filter(
    (f) => !(f._id.toString() === strFieldId && f.farmerId.toString() === strFarmerId)
  );
  if (data.fields.length === beforeCount) return false;

  data.fertilizers = (data.fertilizers || []).filter(
    (fr) => fr.fieldId.toString() !== strFieldId
  );
  saveLocalData(data);
  return true;
};

// ================= DISEASE ANALYSIS OPERATIONS =================
export const createAnalysis = async (analysisData) => {
  if (isConnected()) {
    return await DiseaseAnalysis.create(analysisData);
  }
  const data = getLocalData();
  if (!data.analyses) data.analyses = [];
  const newAnalysis = {
    _id: generateId(),
    farmerId: analysisData.farmerId.toString(),
    fieldId: analysisData.fieldId.toString(),
    imageUrl: analysisData.imageUrl,
    predictedCondition: analysisData.predictedCondition,
    confidence: Number(analysisData.confidence),
    modelName: analysisData.modelName || 'rodynaemad/plant-disease-dinov2-small',
    modelVersion: analysisData.modelVersion || 'rodynaemad/plant-disease-dinov2-small',
    predictionStatus: analysisData.predictionStatus || 'classified',
    diagnosisStatus: analysisData.diagnosisStatus || analysisData.predictionStatus || 'classified',
    confidenceLevel: analysisData.confidenceLevel || 'Moderate',
    cropSupported: analysisData.cropSupported !== undefined ? analysisData.cropSupported : true,
    selectedCrop: analysisData.selectedCrop || '',
    imageQuality: analysisData.imageQuality || 'good',
    centroidSimilarity: analysisData.centroidSimilarity !== undefined ? analysisData.centroidSimilarity : null,
    isOutOfDistribution: Boolean(analysisData.isOutOfDistribution),
    topPredictions: analysisData.topPredictions || [],
    reviewedByExpert: Boolean(analysisData.reviewedByExpert),
    weatherContext: analysisData.weatherContext || {},
    conditionDescription: analysisData.conditionDescription || '',
    analysisDate: analysisData.analysisDate || new Date().toISOString(),
  };
  data.analyses.push(newAnalysis);
  saveLocalData(data);
  return newAnalysis;
};

export const findAnalysesByFarmerId = async (farmerId) => {
  const strFarmerId = farmerId.toString();
  if (isConnected()) {
    return await DiseaseAnalysis.find({ farmerId: strFarmerId })
      .populate('fieldId', 'fieldName cropName location')
      .sort({ analysisDate: -1 })
      .lean();
  }
  const data = getLocalData();
  const analyses = (data.analyses || [])
    .filter((a) => a.farmerId.toString() === strFarmerId)
    .sort((a, b) => new Date(b.analysisDate) - new Date(a.analysisDate));

  return analyses.map((a) => {
    const field = (data.fields || []).find((f) => f._id.toString() === a.fieldId.toString());
    return {
      ...a,
      fieldId: field ? { _id: field._id, fieldName: field.fieldName, cropName: field.cropName, location: field.location } : null,
    };
  });
};

export const findAnalysisById = async (id, farmerId = null) => {
  const strId = id.toString();
  if (isConnected()) {
    const query = { _id: strId };
    if (farmerId) query.farmerId = farmerId.toString();
    return await DiseaseAnalysis.findOne(query)
      .populate('fieldId')
      .lean();
  }
  const data = getLocalData();
  const analysis = (data.analyses || []).find(
    (a) => a._id.toString() === strId && (!farmerId || a.farmerId.toString() === farmerId.toString())
  );
  if (!analysis) return null;
  const field = (data.fields || []).find((f) => f._id.toString() === analysis.fieldId.toString());
  return {
    ...analysis,
    fieldId: field || null,
  };
};

// ================= ADVISORY OPERATIONS =================
export const createAdvisory = async (advisoryData) => {
  if (isConnected()) {
    return await Advisory.create(advisoryData);
  }
  const data = getLocalData();
  if (!data.advisories) data.advisories = [];
  const newAdvisory = {
    _id: generateId(),
    analysisId: advisoryData.analysisId.toString(),
    fieldId: advisoryData.fieldId.toString(),
    possibleCauses: advisoryData.possibleCauses || [],
    contributingFactors: advisoryData.contributingFactors || {},
    precautions: advisoryData.precautions || [],
    recommendedNextSteps: advisoryData.recommendedNextSteps || [],
    expertConsultation: advisoryData.expertConsultation || '',
    weatherContext: advisoryData.weatherContext || { isAvailable: false },
    createdAt: new Date().toISOString(),
  };
  data.advisories.push(newAdvisory);
  saveLocalData(data);
  return newAdvisory;
};

export const findAdvisoryByAnalysisId = async (analysisId) => {
  const strAnalysisId = analysisId.toString();
  if (isConnected()) {
    return await Advisory.findOne({ analysisId: strAnalysisId }).lean();
  }
  const data = getLocalData();
  return (data.advisories || []).find((a) => a.analysisId.toString() === strAnalysisId) || null;
};

export const findRecentAdvisoriesByFarmerId = async (farmerId, limit = 5) => {
  const analyses = await findAnalysesByFarmerId(farmerId);
  const result = [];
  for (const analysis of analyses.slice(0, limit)) {
    const advisory = await findAdvisoryByAnalysisId(analysis._id);
    if (advisory) {
      result.push({
        analysis,
        advisory,
      });
    }
  }
  return result;
};

// ================= DASHBOARD STATISTICS =================
export const getFarmerStats = async (farmerId) => {
  const strFarmerId = farmerId.toString();
  const fields = await findFieldsByFarmerId(strFarmerId);
  const analyses = await findAnalysesByFarmerId(strFarmerId);

  const totalFields = fields.length;
  const totalAreaAcres = fields.reduce((acc, f) => {
    // convert hectares to acres (1 ha = 2.47105 acres) for uniform summation
    const area = Number(f.area) || 0;
    if (f.areaUnit === 'Hectares') {
      return acc + (area * 2.47105);
    }
    return acc + area;
  }, 0);

  const plantedCropsCount = fields.filter((f) => f.isCropPlanted).length;
  const totalAnalyses = analyses.length;

  return {
    totalFields,
    totalAreaAcres: Number(totalAreaAcres.toFixed(2)),
    plantedCropsCount,
    totalAnalyses,
  };
};
