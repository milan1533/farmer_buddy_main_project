@echo off
echo 🚀 Setting up Farmer Buddy Project...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Backend setup
echo 📦 Setting up backend...
cd backend

REM Install dependencies
echo Installing backend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating backend .env file...
    (
        echo MONGO_URL=mongodb://localhost:27017/farmer-buddy
        echo SECRET_CODE=your-super-secret-jwt-key-here
        echo PORT=5000
        echo FRONTEND_URL=http://localhost:5173
    ) > .env
    echo ✅ Backend .env file created
) else (
    echo ✅ Backend .env file already exists
)

cd ..

REM Frontend setup
echo 📦 Setting up frontend...
cd frontend

REM Install dependencies
echo Installing frontend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating frontend .env file...
    (
        echo VITE_BASE_URL=http://localhost:5000
    ) > .env
    echo ✅ Frontend .env file created
) else (
    echo ✅ Frontend .env file already exists
)

cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Start MongoDB service
echo 2. Start backend: cd backend ^&^& npm run dev
echo 3. Start frontend: cd frontend ^&^& npm run dev
echo 4. Open http://localhost:5173 in your browser
echo.
echo 🔧 Make sure to update the .env files with your actual configuration values.
pause


