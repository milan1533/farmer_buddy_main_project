import mongoose from 'mongoose';

const CommunityCommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityPost', required: true },
  author: {
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
  },
  text: { type: String, required: true },
  isSolution: { type: Boolean, default: false }, // If post author marks this as the solution
  likesCount: { type: Number, default: 0 },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityComment', default: null } // For nested replies
}, { timestamps: true });

export const CommunityComment = mongoose.model('CommunityComment', CommunityCommentSchema);
