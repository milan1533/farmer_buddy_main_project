import mongoose from 'mongoose';

const CommunityLikeSchema = new mongoose.Schema({
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Post ID or Comment ID
  targetType: { type: String, enum: ['Post', 'Comment'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional if anonymous likes allowed
  userIp: { type: String, required: false } // To prevent spam if no auth
}, { timestamps: true });

// Ensure unique like per user per target
CommunityLikeSchema.index({ targetId: 1, userId: 1 }, { unique: true });

export const CommunityLike = mongoose.model('CommunityLike', CommunityLikeSchema);
