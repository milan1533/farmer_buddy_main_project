# MongoDB Setup Guide for Farmer Buddy

## Step 1: Install MongoDB

### Option A: Local MongoDB Installation
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install MongoDB on your system
3. Start MongoDB service

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster
4. Get your connection string

## Step 2: Create Environment File

Create a `.env` file in the backend directory with the following content:

```env
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017/farmer-buddy

# For MongoDB Atlas, use:
# MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/farmer-buddy?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173

# JWT Secret (Generate a secure secret for production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

## Step 3: Connect to MongoDB

### Using MongoDB Compass:
1. Open MongoDB Compass
2. Click "Add new connection"
3. Enter connection string:
   - Local: `mongodb://localhost:27017`
   - Atlas: Your Atlas connection string
4. Click "Connect"

### Using Command Line:
```bash
# Start MongoDB service
mongod

# Connect to MongoDB shell
mongosh
```

## Step 4: Start Your Backend

```bash
cd backend
npm install
npm run dev
```

## Step 5: Verify Connection

Check the console output for:
```
MongoDB connected
Server is Running
http://localhost:5000
```

## Database Collections

Your application will create these collections:
- `users` - User accounts (farmers, consumers, restaurants)
- `products` - Product listings
- `orders` - Order management
- `farms` - Farm information (if implemented)

## Troubleshooting

### Common Issues:
1. **Connection refused**: Make sure MongoDB is running
2. **Authentication failed**: Check username/password in connection string
3. **Network timeout**: Check firewall settings and network connectivity

### Useful Commands:
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"

# List databases
mongosh --eval "show dbs"

# Connect to specific database
mongosh farmer-buddy
```
