import { CommunityPost } from '../models/CommunityPost.model.js';
import { CommunityComment } from '../models/CommunityComment.model.js';
import { CommunityLike } from '../models/CommunityLike.model.js';
import { generateJSON } from '../services/gemini.service.js';

// --- Feed & Posts ---

export const getCommunityFeed = async (req, res) => {
  try {
    const { crop, problemType, season, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (crop) query['content.crop'] = crop;
    if (problemType) query['content.problemType'] = problemType;
    if (season) query['metadata.season'] = season;

    const posts = await CommunityPost.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Ensure mediaUrl is absolute for frontend rendering
    const baseUrl = process.env.VITE_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const normalized = posts.map((p) => {
      const plain = p.toObject();
      const url = plain?.content?.mediaUrl || '';
      if (url && !/^https?:\/\//i.test(url)) {
        plain.content.mediaUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
      }
      return plain;
    });

    res.json({ success: true, data: normalized });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { author, content, metadata } = req.body;
    
    // Optional: Auto-generate AI summary or tags
    let aiSummary = '';
    try {
      const prompt = `Analyze this farming issue. Crop: ${content.crop}, Issue: ${content.description}. Return a JSON object with a key "summary" containing a 1-sentence helpful summary or advice.`;
      const aiRes = await generateJSON(prompt);
      aiSummary = aiRes.summary || ''; 
    } catch (e) { console.log('AI Summary skipped', e.message); }

    const newPost = new CommunityPost({
      author,
      content,
      metadata,
      aiSummary
    });

    await newPost.save();
    res.status(201).json({ success: true, data: newPost });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPostDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await CommunityPost.findById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    
    // Get comments
    const comments = await CommunityComment.find({ postId: id }).sort({ createdAt: -1 });
    
    res.json({ success: true, data: { post, comments } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Interactions ---

export const likeTarget = async (req, res) => {
  try {
    const { targetId, targetType, userId } = req.body;
    
    // Check if already liked
    const existing = await CommunityLike.findOne({ targetId, userId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already liked' });
    }

    await CommunityLike.create({ targetId, targetType, userId });

    // Update counts
    if (targetType === 'Post') {
      await CommunityPost.findByIdAndUpdate(targetId, { $inc: { 'stats.likesCount': 1 } });
    } else {
      await CommunityComment.findByIdAndUpdate(targetId, { $inc: { likesCount: 1 } });
    }

    res.json({ success: true, message: 'Liked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId, author, text } = req.body;
    
    const newComment = new CommunityComment({
      postId,
      author,
      text
    });
    await newComment.save();

    // Update post comment count
    await CommunityPost.findByIdAndUpdate(postId, { $inc: { 'stats.commentsCount': 1 } });

    res.status(201).json({ success: true, data: newComment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const { postId } = req.query;
    if (!postId) {
      return res.status(400).json({ success: false, message: 'postId is required' });
    }
    const comments = await CommunityComment.find({ postId }).sort({ createdAt: -1 });
    return res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Media Upload ---
export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    // multer sets filename; server statically serves /uploads
    const baseUrl = process.env.VITE_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    const isVideo = req.file.mimetype.startsWith('video/');
    const isImage = req.file.mimetype.startsWith('image/');
    if (!isVideo && !isImage) {
      return res.status(400).json({ success: false, message: 'Unsupported file type' });
    }
    res.status(201).json({ success: true, url: fileUrl, type: isVideo ? 'video' : 'image' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Admin Moderation ---
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await CommunityPost.findById(id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    await CommunityComment.deleteMany({ postId: id });
    try { await CommunityLike.deleteMany({ targetId: id }); } catch {}
    await CommunityPost.findByIdAndDelete(id);
    return res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await CommunityComment.findById(id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    await CommunityComment.findByIdAndDelete(id);
    try {
      await CommunityPost.findByIdAndUpdate(comment.postId, { $inc: { 'stats.commentsCount': -1 } });
    } catch {}
    return res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
