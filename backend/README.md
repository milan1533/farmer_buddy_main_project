# FarmFresh AI Backend Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB Community Server** (v4.4 or higher)
3. **Git** (for cloning the repository)

## Step 1: Install MongoDB Community Server

### Option A: Install MongoDB Locally (Windows)

1. **Download MongoDB Community Server**:
   - Go to [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Download the latest version for Windows (64-bit)

2. **Install MongoDB**:
   - Run the installer (.msi file)
   - Choose "Complete" installation
   - Make sure to check "Install MongoDB as a Service"
   - Choose "Run service as Network Service user"

3. **Start MongoDB Service**:
   ```bash
   # Open Command Prompt as Administrator
   net start MongoDB
   ```

4. **Verify Installation**:
   ```bash
   mongosh --version
   mongo --version
   ```

### Option B: Use MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster**:
   - Click "Build a Cluster"
   - Choose "Free" tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Create Database User**:
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and password
   - Grant "Read and write" permissions

4. **Whitelist IP Address**:
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Clusters" in the left sidebar
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your actual password

## Step 2: Backend Setup

1. **Navigate to Backend Directory**:
   ```bash
   cd FarmFresh-Ai-main/backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Open the `.env` file in the backend directory
   - Update the following variables:

   For Local MongoDB:
   ```env
   MONGO_URL=mongodb://localhost:27017/farmer-buddy
   ```

   For MongoDB Atlas:
   ```env
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/farmer-buddy?retryWrites=true&w=majority
   ```

   - Replace `username` and `password` with your Atlas credentials
   - Change `SECRET_CODE` to a strong secret key

4. **Start the Backend Server**:
   ```bash
   npm run dev
   ```

   You should see:
   ```
   🚀 Server is Running on port 5000
   📱 Frontend URL: http://localhost:5173
   🔗 Health check: http://localhost:5000/health
   ✅ MongoDB connected successfully
   ```

## Step 3: Test the Backend

1. **Test Health Endpoint**:
   ```bash
   curl http://localhost:5000/health
   ```

   Expected response:
   ```json
   {
     "status": "OK",
     "message": "Server is running",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```

2. **Test Registration**:
   ```bash
   curl -X POST http://localhost:5000/auth/signup \
   -H "Content-Type: application/json" \
   -d '{
     "name": "Test User",
     "email": "test@example.com",
     "password": "password123",
     "role": "consumer",
     "address": "123 Test Street",
     "city": "Test City",
     "zipCode": "12345",
     "phone": "1234567890"
   }'
   ```

3. **Test Login**:
   ```bash
   curl -X POST http://localhost:5000/auth/login \
   -H "Content-Type: application/json" \
   -d '{
     "email": "test@example.com",
     "password": "password123",
     "role": "consumer"
   }'
   ```

## Step 4: Frontend Setup

1. **Navigate to Frontend Directory**:
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the frontend directory:
   ```env
   VITE_BASE_URL=http://localhost:5000
   ```

4. **Start the Frontend**:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Failed**:
   - Make sure MongoDB service is running: `net start MongoDB`
   - Check if MONGO_URL is correct in `.env`
   - For Atlas: Make sure IP is whitelisted and credentials are correct

2. **Port Already in Use**:
   - Change PORT in `.env` file
   - Kill process using the port: `netstat -ano | findstr :5000`

3. **CORS Issues**:
   - Make sure FRONTEND_URL in backend `.env` matches your frontend URL
   - Default is `http://localhost:5173`

4. **Registration/Login Not Working**:
   - Check browser console for errors
   - Verify API endpoints are correct
   - Make sure backend is running on correct port

### Debug Commands:

```bash
# Check MongoDB status
net start MongoDB

# Check if port is in use
netstat -ano | findstr :5000

# Kill process on port 5000
taskkill /PID <PID> /F

# Test MongoDB connection
mongosh "mongodb://localhost:27017/farmer-buddy"
```

## Environment Variables Reference

### Backend (.env)
```env
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017/farmer-buddy

# JWT Secret Key
SECRET_CODE=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_BASE_URL=http://localhost:5000
```

## Next Steps

1. Test user registration and login
2. Add products as a farmer
3. Browse marketplace as a consumer
4. Test order placement and management
5. Explore AI features (chatbot, image analysis, etc.)

For more help, check the main README.md file or open an issue in the repository.
