import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaLeaf, FaComment, FaHeart, FaShare, FaUpload, FaUserCircle, FaSpinner, FaImage, FaVideo } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const API_BASE = `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}/api/community`;

const FarmerCommunity = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'create'
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdminUser = user?.role === 'Admin' || user?.role === 'admin';
  const inAdmin = location.pathname.startsWith('/admin');
  const isAdmin = isAdminUser && inAdmin;
  
  // Form State
  const [formData, setFormData] = useState({
    authorName: 'Farmer Joe',
    crop: '',
    problemType: 'Disease',
    description: '',
    month: new Date().toLocaleString('default', { month: 'long' }),
    season: 'Kharif' // Default, should be auto-detected ideally
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  // Fetch Feed
  const fetchFeed = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/feed`);
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
      toast.error("Failed to load community feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  // Handle Create Post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Upload media if provided
      let mediaUrl = '';
      let mediaType = 'none';
      const uploadMedia = async (file) => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await axios.post(`${API_BASE}/upload`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.success) return res.data.url;
        throw new Error('Upload failed');
      };
      if (videoFile) {
        mediaUrl = await uploadMedia(videoFile);
        mediaType = 'video';
      } else if (imageFile) {
        mediaUrl = await uploadMedia(imageFile);
        mediaType = 'image';
      }

      const payload = {
        author: { name: formData.authorName },
        content: {
          crop: formData.crop,
          problemType: formData.problemType,
          description: formData.description,
          mediaType,
          mediaUrl
        },
        metadata: {
          month: formData.month,
          season: formData.season,
          location: 'India'
        }
      };

      const res = await axios.post(`${API_BASE}/posts`, payload);
      if (res.data.success) {
        toast.success("Post shared successfully!");
        setFormData({ ...formData, description: '', crop: '' }); // Reset partial
        setImageFile(null);
        setVideoFile(null);
        setActiveTab('feed');
        fetchFeed();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to post. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Like
  const handleLike = async (postId) => {
    try {
      // Optimistic update
      setPosts(prev => prev.map(p => 
        p._id === postId ? { ...p, stats: { ...p.stats, likesCount: p.stats.likesCount + 1 } } : p
      ));
      
      await axios.post(`${API_BASE}/like`, {
        targetId: postId,
        targetType: 'Post',
        userId: 'temp-user-id-' + Math.random() // Simulation since no auth
      });
    } catch (error) {
      // Revert if failed (omitted for brevity)
      console.error("Like failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <FaLeaf /> Farmer Community
          </h1>
          <button 
            onClick={() => fetchFeed()}
            className="text-sm bg-green-700 px-3 py-1 rounded-full hover:bg-green-800"
          >
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4">
        
        {/* Tabs */}
        <div className="flex bg-white rounded-xl shadow p-1 mb-6">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${activeTab === 'feed' ? 'bg-green-100 text-green-700' : 'text-gray-500'}`}
          >
            Community Feed
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 rounded-lg font-medium transition ${activeTab === 'create' ? 'bg-green-100 text-green-700' : 'text-gray-500'}`}
          >
            Share Problem
          </button>
        </div>

        {/* FEED VIEW */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-10 text-green-600">
                <FaSpinner className="animate-spin text-3xl" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No posts yet. Be the first to share!
              </div>
            ) : (
              posts.map(post => (
                <PostCard key={post._id} post={post} onLike={handleLike} isAdmin={isAdmin} onDeleted={fetchFeed} />
              ))
            )}
          </div>
        )}

        {/* CREATE VIEW */}
        {activeTab === 'create' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Ask the Community</h2>

            {/* Media Upload Options */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <span className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <FaImage /> Upload Image
                </span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="w-full"
                  onChange={e => setImageFile(e.target.files[0] || null)}
                />
                {imageFile && (
                  <p className="text-xs text-gray-500 mt-2">Selected: {imageFile.name}</p>
                )}
              </label>
              <label className="block p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <span className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                  <FaVideo /> Upload Video
                </span>
                <input 
                  type="file" 
                  accept="video/*" 
                  className="w-full"
                  onChange={e => setVideoFile(e.target.files[0] || null)}
                />
                {videoFile && (
                  <p className="text-xs text-gray-500 mt-2">Selected: {videoFile.name}</p>
                )}
              </label>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  className="w-full border rounded-lg p-2"
                  value={formData.authorName}
                  onChange={e => setFormData({...formData, authorName: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Wheat"
                    className="w-full border rounded-lg p-2"
                    value={formData.crop}
                    onChange={e => setFormData({...formData, crop: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                  <select 
                    className="w-full border rounded-lg p-2"
                    value={formData.problemType}
                    onChange={e => setFormData({...formData, problemType: e.target.value})}
                  >
                    <option>Disease</option>
                    <option>Pest</option>
                    <option>Nutrition</option>
                    <option>Growth</option>
                    <option>Success Story</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="w-full border rounded-lg p-2 h-32"
                  placeholder="Describe the issue clearly..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {submitting ? <FaSpinner className="animate-spin" /> : <FaShare />}
                Post to Community
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
};

const PostCard = ({ post, onLike, isAdmin, onDeleted }) => {
  const [showComments, setShowComments] = React.useState(false);
  const [comments, setComments] = React.useState([]);
  const [loadingComments, setLoadingComments] = React.useState(false);
  const [commentText, setCommentText] = React.useState('');
  const [commenting, setCommenting] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const res = await axios.get(`${API_BASE}/comments`, { params: { postId: post._id } });
      if (res.data.success) setComments(res.data.data);
    } catch (e) {
      console.error('Load comments failed', e);
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next && comments.length === 0) fetchComments();
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      setCommenting(true);
      const payload = {
        postId: post._id,
        author: { name: 'Guest User' },
        text: commentText.trim(),
      };
      const res = await axios.post(`${API_BASE}/comments`, payload);
      if (res.data.success) {
        setComments((prev) => [res.data.data, ...prev]);
        setCommentText('');
      }
    } catch (e) {
      console.error('Add comment failed', e);
    } finally {
      setCommenting(false);
    }
  };

  // Admin-only delete actions
  const handleDeletePost = async () => {
    if (!isAdmin) return;
    if (!confirm('Delete this post?')) return;
    try {
      setDeleting(true);
      await axios.delete(`${API_BASE}/posts/${post._id}`, {
        withCredentials: true,
        headers: (() => {
          const t = localStorage.getItem('token');
          return t ? { Authorization: `Bearer ${t}` } : {};
        })(),
      });
      onDeleted && onDeleted();
    } catch (e) {
      console.error('Delete post failed', e);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteComment = async (id) => {
    if (!isAdmin) return;
    try {
      await axios.delete(`${API_BASE}/comments/${id}`, {
        withCredentials: true,
        headers: (() => {
          const t = localStorage.getItem('token');
          return t ? { Authorization: `Bearer ${t}` } : {};
        })(),
      });
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (e) {
      console.error('Delete comment failed', e);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-50">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
          <FaUserCircle size={24} />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">{post.author?.name || 'Unknown User'}</h3>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()} • {post.metadata.season}
          </p>
        </div>
        <span className={`ml-auto px-2 py-1 rounded text-xs font-bold ${
          post.content.problemType === 'Success Story' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'
        }`}>
          {post.content.problemType}
        </span>
        {isAdmin && (
          <button onClick={handleDeletePost} disabled={deleting} className="ml-2 text-sm text-red-600 hover:underline disabled:opacity-50">
            Delete
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-bold text-lg mb-2 text-green-800">{post.content.crop}</h4>
        <p className="text-gray-700 leading-relaxed mb-4">
          {post.content.description}
        </p>
        
        {/* Media Preview */}
        {post.content.mediaType === 'image' && post.content.mediaUrl && (
          <img 
            src={post.content.mediaUrl} 
            alt={post.content.crop} 
            className="w-full rounded-lg border mb-4"
          />
        )}
        {post.content.mediaType === 'video' && post.content.mediaUrl && (
          <video 
            src={post.content.mediaUrl} 
            controls 
            className="w-full rounded-lg border mb-4"
          />
        )}
        
        {post.aiSummary && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm text-blue-800 mb-4">
            <span className="font-bold">🤖 AI Insight:</span> {post.aiSummary}
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-100">
        <button 
          onClick={() => onLike(post._id)}
          className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition"
        >
          <FaHeart /> <span className="text-sm font-medium">{post.stats.likesCount} Likes</span>
        </button>
        <button onClick={toggleComments} className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition">
          <FaComment /> <span className="text-sm font-medium">{post.stats.commentsCount + comments.length} Comments</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition">
          <FaShare /> <span className="text-sm font-medium">Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <form onSubmit={submitComment} className="flex gap-2 py-3">
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 border rounded-lg p-2"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button disabled={commenting} className="px-3 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50">Post</button>
          </form>
          {loadingComments ? (
            <div className="text-sm text-gray-500 py-2">Loading comments...</div>
          ) : comments.length === 0 ? (
            <div className="text-sm text-gray-400 py-2">No comments yet</div>
          ) : (
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c._id} className="bg-gray-50 rounded-lg p-2 flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">{c.author?.name || 'User'} • {new Date(c.createdAt).toLocaleString()}</div>
                    <div className="text-sm text-gray-800">{c.text}</div>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleDeleteComment(c._id)} className="text-xs text-red-600 hover:underline">Delete</button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmerCommunity;
