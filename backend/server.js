// server.js
import express from 'express'
import AuthRouter from './routes/Auth.route.js';
import dotenv from 'dotenv'
import connectDB from './config/connectdb.js';
import productRoute from './routes/product.routes.js';
// import orderRouter from './routes/order.routes.js';
import imageAnalysisRouter from './routes/imageAnalysis.routes.js';
// import isAuthenticated from './middleware/isAutheticated.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

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
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
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
// app.use("/order", isAuthenticated, orderRouter);
app.use("/api", imageAnalysisRouter);

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
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
