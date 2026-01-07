import express from 'express';
import multer from 'multer';
import path from 'path';
import isAuthenticated from '../middleware/isAutheticated.js';
import authorizeRoles from '../middleware/authorizeRole.js';
import { 
  getCommunityFeed, 
  createPost, 
  getPostDetails, 
  likeTarget, 
  addComment,
  getComments,
  deletePost,
  deleteComment,
  uploadMedia
} from '../controllers/community.controller.js';

const router = express.Router();

// Multer disk storage for images/videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'backend', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image or video files are allowed'), false);
  }
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });

// Feed & Posts
router.get('/feed', getCommunityFeed);
router.post('/posts', createPost);
router.get('/posts/:id', getPostDetails);
// Admin moderation
router.delete('/posts/:id', isAuthenticated, authorizeRoles('admin'), deletePost);

// Interactions
router.post('/like', likeTarget);
router.post('/comments', addComment);
router.get('/comments', getComments);
router.delete('/comments/:id', isAuthenticated, authorizeRoles('admin'), deleteComment);

// Media upload
router.post('/upload', upload.single('file'), uploadMedia);

export default router;
