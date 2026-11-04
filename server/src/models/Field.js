import mongoose from 'mongoose';

const fieldSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  fieldName: {
    type: String,
    required: [true, 'Field name is required'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true,
  },
  village: {
    type: String,
    required: [true, 'Village is required'],
    trim: true,
  },
  area: {
    type: Number,
    required: [true, 'Field area is required'],
    min: 0.01,
  },
  areaUnit: {
    type: String,
    enum: ['Acres', 'Hectares'],
    default: 'Acres',
  },
  soilType: {
    type: String,
    enum: [
      'Alluvial Soil',
      'Black Soil',
      'Red Soil',
      'Laterite Soil',
      'Sandy Soil',
      'Clay Soil',
      'Loamy Soil',
      'Other',
    ],
    required: true,
  },
  irrigationMethod: {
    type: String,
    enum: [
      'Drip Irrigation',
      'Sprinkler Irrigation',
      'Flood Irrigation',
      'Rainfed',
      'Other',
    ],
    required: true,
  },
  previousCrop: {
    type: String,
    default: '',
    trim: true,
  },
  isCropPlanted: {
    type: Boolean,
    default: false,
  },
  cropName: {
    type: String,
    default: '',
    trim: true,
  },
  cropVariety: {
    type: String,
    default: '',
    trim: true,
  },
  plantingDate: {
    type: Date,
    default: null,
  },
  digipin: {
    type: String,
    default: '',
    trim: true,
  },
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  state: {
    type: String,
    default: '',
    trim: true,
  },
  pincode: {
    type: String,
    default: '',
    trim: true,
  },
  locationSource: {
    type: String,
    enum: ['digipin', 'map', 'gps', 'manual', ''],
    default: 'manual',
  },
  // --- Soil Health & Nutrients (Optional) ---
  soilPh: {
    type: Number,
    default: null,
    min: 3.0,
    max: 10.5,
  },
  soilNitrogen: {
    type: Number,
    default: null, // kg/ha
  },
  soilPhosphorus: {
    type: Number,
    default: null, // kg/ha
  },
  soilPotassium: {
    type: Number,
    default: null, // kg/ha
  },
  organicCarbon: {
    type: Number,
    default: null, // % percentage
  },
  electricalConductivity: {
    type: Number,
    default: null, // dS/m (salinity)
  },
  soilDrainage: {
    type: String,
    enum: ['Well-drained', 'Moderate', 'Poor / Waterlogged', 'Excessive', ''],
    default: '',
  },
  zinc: {
    type: Number,
    default: null, // ppm
  },
  iron: {
    type: Number,
    default: null, // ppm
  },
  boron: {
    type: Number,
    default: null, // ppm
  },
  soilTestDate: {
    type: Date,
    default: null,
  },
  soilTestNotes: {
    type: String,
    default: '',
    trim: true,
  },
  // --- Water Availability & Infrastructure ---
  waterSource: {
    type: String,
    enum: [
      'Borewell',
      'Canal',
      'River / Stream',
      'Farm Pond / Tank',
      'Rainwater / Rainfed',
      'Reservoir',
      'Other',
      '',
    ],
    default: '',
  },
  waterAvailability: {
    type: String,
    enum: ['High', 'Moderate', 'Low', ''],
    default: '',
  },
  seasonalAvailability: {
    type: String,
    enum: [
      'Year-round',
      'Monsoon only',
      'Winter & Summer limited',
      'Seasonal / Critical periods',
      '',
    ],
    default: '',
  },
  irrigationFrequency: {
    type: String,
    default: '',
    trim: true,
  },
  estimatedWaterQuantity: {
    type: String,
    default: '',
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Field = mongoose.model('Field', fieldSchema);
