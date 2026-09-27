import mongoose from 'mongoose';

const CommunityPostSchema = new mongoose.Schema({
  author: {
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    // Optionally link to existing User model if needed, but keeping it loose for isolation
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
  },
  content: {
    crop: { type: String, required: true },
    problemType: { type: String, enum: ['Disease', 'Pest', 'Nutrition', 'Growth', 'Other', 'Success Story'], required: true },
    description: { type: String, required: true },
    mediaUrl: { type: String, default: '' }, // URL for Image/Video
    mediaType: { type: String, enum: ['image', 'video', 'none'], default: 'none' },
    mediaPublicId: { type: String, default: '' } // Cloudinary public_id for cleanup
  },
  metadata: {
    month: { type: String, required: true },
    season: { type: String, required: true },
    location: { type: String, default: 'India' }
  },
  stats: {
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharesCount: { type: Number, default: 0 }
  },
  isSolved: { type: Boolean, default: false },
  tags: [{ type: String }],
  aiSummary: { type: String, default: '' }
}, { timestamps: true });

export const CommunityPost = mongoose.model('CommunityPost', CommunityPostSchema);
