// controllers/community.controller.js
// ✅ MongoDB/Mongoose removed → Supabase PostgreSQL
import supabase from '../config/supabase.js';
import { generateJSON } from '../services/gemini.service.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const ANON_USER_ID = '00000000-0000-0000-0000-000000000001';
const VALID_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Ensure at least one fallback user exists so FK constraints never block posts/likes/comments
const ensureFallbackUser = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', ANON_USER_ID)
      .maybeSingle();
    if (error) {
      console.warn('ensureFallbackUser lookup error:', error.message);
    }
    if (!data) {
      const passwordHash =
        '$2a$10$placeholder.hash.do.not.use.directlyxxxxxxxxxxxxxxxxxxxxxx';
      const { error: insErr } = await supabase.from('users').insert({
        id: ANON_USER_ID,
        name: 'Guest Farmer',
        email: 'guest-farmer-001@farmfresh.local',
        password_hash: passwordHash,
        role: 'farmer',
        phone: '0000000000',
      });
      if (insErr) console.warn('Fallback user insert (may already exist):', insErr.message);
    }
    return ANON_USER_ID;
  } catch (e) {
    console.warn('ensureFallbackUser threw:', e.message);
    return ANON_USER_ID;
  }
};

const resolveUserId = async (candidate, preferAuth = null) => {
  if (preferAuth && VALID_UUID.test(String(preferAuth))) return preferAuth;
  let id = null;
  if (candidate) {
    if (typeof candidate === 'string') id = candidate;
    else if (typeof candidate === 'object') {
      id = candidate.id || candidate.userId || candidate._id || null;
    }
  }
  if (id && VALID_UUID.test(id)) return id;
  return ensureFallbackUser();
};

// --- Feed & Posts ---

export const getCommunityFeed = async (req, res) => {
  try {
    const { crop, problemType, season, page = 1, limit = 10 } = req.query;
    
    let query = supabase
      .from('community_posts')
      .select('*, users:author_id (name, role)')
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    // Filter by content JSONB fields
    if (crop) query = query.eq('content->>crop', crop);
    if (problemType) query = query.eq('content->>problemType', problemType);
    if (season) query = query.eq('metadata->>season', season);

    const { data: posts, error } = await query;
    if (error) throw error;

    const baseUrl = process.env.VITE_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const normalized = posts.map((p) => {
      const url = p?.content?.mediaUrl || '';
      if (url && !/^https?:\/\//i.test(url)) {
        p.content.mediaUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
      }
      return { ...p, _id: p.id };
    });

    res.json({ success: true, data: normalized });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { author, content, metadata } = req.body;

    let authorName = 'Anonymous Farmer';
    if (author && typeof author === 'object' && author.name) authorName = author.name;

    // Always guarantee a valid user id for the FK constraint
    const authUserId = req.id || req.user?._id || null;
    const finalAuthorId = await resolveUserId(author, authUserId);

    // Auto-generate AI summary (optional - do not fail post creation)
    let aiSummary = '';
    try {
      const prompt =
        'Analyze this farming issue. Crop: ' +
        (content?.crop || 'unknown') +
        ', Issue: ' +
        (content?.description || 'unknown') +
        '. Return a JSON object with a key "summary" containing a 1-sentence helpful summary or advice.';
      const aiRes = await generateJSON(prompt);
      aiSummary = aiRes?.summary || '';
    } catch (e) {
      console.log('AI Summary skipped:', String(e.message || '').substring(0, 120));
    }

    const finalContent = {
      ...(content || {}),
      authorName: (content && content.authorName) || authorName,
    };

    const insertPayload = {
      author_id: finalAuthorId,
      content: finalContent,
      metadata: metadata || {},
      ai_summary: aiSummary,
      stats: { likesCount: 0, commentsCount: 0, sharesCount: 0 },
    };

    const { data: newPost, error } = await supabase
      .from('community_posts')
      .insert(insertPayload)
      .select()
      .single();

    if (error || !newPost) {
      throw new Error((error && error.message) || 'Failed to save post');
    }

    res.status(201).json({ success: true, data: { ...newPost, _id: newPost.id } });
  } catch (error) {
    console.error('createPost error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

export const getPostDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: post, error } = await supabase
      .from('community_posts')
      .select('*, users:author_id (name, role)')
      .eq('id', id)
      .single();

    if (error || !post) return res.status(404).json({ success: false, message: 'Post not found' });
    
    const { data: comments } = await supabase
      .from('community_comments')
      .select('*, users:author_id (name, role)')
      .eq('post_id', id)
      .order('created_at', { ascending: false });
    
    res.json({ success: true, data: { post: { ...post, _id: post.id }, comments: comments?.map(c => ({ ...c, _id: c.id })) || [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Interactions ---

export const likeTarget = async (req, res) => {
  try {
    const { targetId, targetType, userId: rawUserId } = req.body;

    const authUserId = req.id || req.user?._id || null;
    const finalUserId = await resolveUserId(rawUserId, authUserId);

    try {
      const { data: existing } = await supabase
        .from('community_likes')
        .select('id')
        .eq('post_id', targetId)
        .eq('user_id', finalUserId)
        .maybeSingle();

      if (existing) {
        return res.status(400).json({ success: false, message: 'Already liked' });
      }

      await supabase
        .from('community_likes')
        .insert({ post_id: targetId, user_id: finalUserId });
    } catch (likeErr) {
      console.warn(
        'Like insert warning (may already like):',
        String(likeErr.message || '').substring(0, 100)
      );
    }

    try {
      const { data: post } = await supabase
        .from('community_posts')
        .select('stats')
        .eq('id', targetId)
        .maybeSingle();

      if (post) {
        const newStats = {
          likesCount: (post.stats?.likesCount || 0) + 1,
          commentsCount: post.stats?.commentsCount || 0,
          sharesCount: post.stats?.sharesCount || 0,
        };
        await supabase
          .from('community_posts')
          .update({ stats: newStats })
          .eq('id', targetId);
      }
    } catch (_) {}

    res.json({ success: true, message: 'Liked' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId, author, text } = req.body;

    const authUserId = req.id || req.user?._id || null;
    const finalAuthorId = await resolveUserId(author, authUserId);

    const { data: newComment, error } = await supabase
      .from('community_comments')
      .insert({ post_id: postId, author_id: finalAuthorId, text })
      .select()
      .single();

    if (error || !newComment) {
      throw new Error((error && error.message) || 'Failed to add comment');
    }

    try {
      const { data: post } = await supabase
        .from('community_posts')
        .select('stats')
        .eq('id', postId)
        .maybeSingle();
      if (post) {
        const newStats = {
          likesCount: post.stats?.likesCount || 0,
          commentsCount: (post.stats?.commentsCount || 0) + 1,
          sharesCount: post.stats?.sharesCount || 0,
        };
        await supabase
          .from('community_posts')
          .update({ stats: newStats })
          .eq('id', postId);
      }
    } catch (_) {}

    res.status(201).json({ success: true, data: { ...newComment, _id: newComment.id } });
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
    const { data: comments, error } = await supabase
      .from('community_comments')
      .select('*, users:author_id (name, role)')
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ success: true, data: comments.map(c => ({ ...c, _id: c.id })) });
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
    
    const isVideo = req.file.mimetype.startsWith('video/');
    const isImage = req.file.mimetype.startsWith('image/');
    
    if (!isVideo && !isImage) {
      return res.status(400).json({ success: false, message: 'Unsupported file type' });
    }

    let fileUrl = null;
    let mediaPublicId = null;

    // Try Cloudinary first
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
          folder: 'farmer-buddy/community',
          resource_type: 'auto',
        });
        try { fs.unlinkSync(req.file.path); } catch {}
        fileUrl = cloudinaryResult.secure_url;
        mediaPublicId = cloudinaryResult.public_id;
      } catch (cloudinaryErr) {
        console.warn('Cloudinary upload failed, trying Supabase Storage:', cloudinaryErr?.message);
      }
    }

    // Supabase Storage fallback
    if (!fileUrl) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        const fileName = `community/${Date.now()}_${req.file.originalname}`;
        const { error: uploadError } = await supabase.storage
          .from('farm-fresh-uploads')
          .upload(fileName, fileBuffer, { contentType: req.file.mimetype });
        
        try { fs.unlinkSync(req.file.path); } catch {}
        
        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('farm-fresh-uploads').getPublicUrl(fileName);
          fileUrl = urlData.publicUrl;
        }
      } catch (storageErr) {
        console.warn('Supabase storage failed, using local:', storageErr?.message);
        const baseUrl = process.env.VITE_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
      }
    }

    res.status(201).json({
      success: true,
      url: fileUrl,
      type: isVideo ? 'video' : 'image',
      publicId: mediaPublicId
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Admin Moderation ---
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: post, error: findError } = await supabase
      .from('community_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !post) return res.status(404).json({ success: false, message: 'Post not found' });
    
    // Delete post (CASCADE deletes comments and likes automatically)
    const { error } = await supabase.from('community_posts').delete().eq('id', id);
    if (error) throw error;

    return res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: comment, error: findError } = await supabase
      .from('community_comments')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    await supabase.from('community_comments').delete().eq('id', id);

    // Decrement comment count on the post
    const { data: post } = await supabase.from('community_posts').select('stats').eq('id', comment.post_id).single();
    if (post) {
      const newStats = { ...post.stats, commentsCount: Math.max(0, (post.stats?.commentsCount || 1) - 1) };
      await supabase.from('community_posts').update({ stats: newStats }).eq('id', comment.post_id);
    }

    return res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
