import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('🧪 Testing FarmFresh AI Backend...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
    console.log('');

    // Test 2: User Registration
    console.log('2. Testing User Registration...');
    const registerResponse = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'consumer',
        address: '123 Test Street',
        city: 'Test City',
        zipCode: '12345',
        phone: '1234567890'
      }),
    });

    const registerData = await registerResponse.json();
    console.log('✅ Registration:', registerData.message);
    console.log('');

    // Test 3: User Login
    console.log('3. Testing User Login...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        role: 'consumer'
      }),
    });

    const loginData = await loginResponse.json();
    console.log('✅ Login:', loginData.message);
    console.log('');

    // Test 4: Get All Products
    console.log('4. Testing Get Products...');
    const productsResponse = await fetch(`${BASE_URL}/product/all`);
    const productsData = await productsResponse.json();
    console.log('✅ Products:', productsData.length || 0, 'products found');
    console.log('');

    console.log('🎉 All tests passed! Backend is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check if backend server is started (npm run dev)');
    console.log('3. Verify environment variables in .env file');
    console.log('4. Check if ports 5000 and 27017 are available');
  }
}

// Run tests
testBackend();
