// server.js
import express from 'express'
import AuthRouter from './routes/Auth.route.js';
import dotenv from 'dotenv'
import { connectDB } from './config/supabase.js';  // ✅ Supabase (MongoDB replaced)
import productRoute from './routes/product.routes.js';
import orderRouter from './routes/order.routes.js';
import imageAnalysisRouter from './routes/imageAnalysis.routes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import adminRouter from './routes/admin.routes.js';
import aiRouter from './routes/ai.routes.js';
import communityRouter from './routes/community.routes.js';

// Load environment variables
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {

  res.end("Milan ye code nahi chalega..")
})

import path from 'path';
import fs from 'fs';

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:5176'
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.ngrok-free.app') || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'authorization', 'X-Requested-With', 'x-auth-token', 'x-access-token']
}));

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'backend', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploads folder as static
app.use('/uploads', express.static(uploadsDir));

app.use('/auth', AuthRouter);
app.use("/product", productRoute);
app.use("/order", orderRouter); // Routes inside orderRouter already have isAuthenticated
app.use("/api", imageAnalysisRouter);
app.use('/admin', adminRouter);
app.use('/api', aiRouter);
app.use('/api/community', communityRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server is Running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
