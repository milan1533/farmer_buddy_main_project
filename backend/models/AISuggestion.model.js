import mongoose from 'mongoose';

const AISuggestionSchema = new mongoose.Schema(
  {
    crop: { type: String, required: true },
    month: { type: String, required: true },
    season: { type: String, enum: ['Rabi', 'Kharif', 'Zaid'], required: true },
    region: {
      state: { type: String, required: true },
      district: { type: String, required: true },
    },
    aiResponse: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 15 }, // TTL: 15 days
  },
  { timestamps: true }
);

AISuggestionSchema.index({ crop: 1, month: 1, season: 1, 'region.state': 1, 'region.district': 1 }, { unique: true });

export const AISuggestionCache = mongoose.model('AISuggestionCache', AISuggestionSchema);
