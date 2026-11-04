import mongoose from 'mongoose';

const fertilizerRecordSchema = new mongoose.Schema({
  fieldId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Field',
    required: true,
  },
  fertilizerName: {
    type: String,
    required: [true, 'Fertilizer name is required'],
    trim: true,
  },
  applicationDate: {
    type: Date,
    required: [true, 'Application date is required'],
    default: Date.now,
  },
});

export const FertilizerRecord = mongoose.model('FertilizerRecord', fertilizerRecordSchema);
