import mongoose from 'mongoose';

const topPredictionSchema = new mongoose.Schema(
  {
    crop: { type: String, default: '' },
    condition: { type: String, default: '' },
    pathogen: { type: String, default: '' },
    confidence: { type: Number, default: 0 },
    isHealthy: { type: Boolean, default: false },
    rawLabel: { type: String, default: '' },
  },
  { _id: false }
);

const diseaseAnalysisSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Farmer',
      required: true,
    },
    fieldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Field',
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    predictedCondition: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    modelName: {
      type: String,
      default: 'rodynaemad/plant-disease-dinov2-small',
    },
    modelVersion: {
      type: String,
      default: 'rodynaemad/plant-disease-dinov2-small',
    },
    predictionStatus: {
      type: String,
      default: 'classified',
    },
    diagnosisStatus: {
      type: String,
      default: 'classified',
    },
    confidenceLevel: {
      type: String,
      default: 'Moderate',
    },
    cropSupported: {
      type: Boolean,
      default: true,
    },
    selectedCrop: {
      type: String,
      default: '',
    },
    imageQuality: {
      type: String,
      default: 'good',
    },
    topPredictions: {
      type: [topPredictionSchema],
      default: [],
    },
    reviewedByExpert: {
      type: Boolean,
      default: false,
    },
    weatherContext: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    conditionDescription: {
      type: String,
      default: '',
    },
    analysisDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const DiseaseAnalysis = mongoose.model('DiseaseAnalysis', diseaseAnalysisSchema);
