import mongoose from 'mongoose';

const advisorySchema = new mongoose.Schema({
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiseaseAnalysis',
    required: true,
  },
  fieldId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
    required: true,
  },
  possibleCauses: {
    type: [String],
    default: [],
  },
  contributingFactors: {
    environmental: { type: String, default: '' },
    waterManagement: { type: String, default: '' },
    fertilizerHistory: { type: String, default: '' },
    growthStage: { type: String, default: '' },
    soilConsiderations: { type: String, default: '' },
  },
  precautions: {
    type: [String],
    default: [],
  },
  recommendedNextSteps: {
    type: [String],
    default: [],
  },
  expertConsultation: {
    type: String,
    default: '',
  },
  weatherContext: {
    temperature: Number,
    humidity: Number,
    weatherCondition: String,
    isAvailable: { type: Boolean, default: false },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Advisory = mongoose.model('Advisory', advisorySchema);
