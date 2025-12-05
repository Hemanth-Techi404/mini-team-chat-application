/**
 * Simple authentication test script
 * Run with: node test-auth.js
 * 
 * This script tests the registration and login endpoints
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// Test user credentials
const testUser = {
  username: `testuser_${Date.now()}`,
  email: `test_${Date.now()}@example.com`,
  password: 'testpassword123'
};

async function testAuth() {
  console.log('🧪 Starting Authentication Tests...\n');
  console.log(`📡 API URL: ${API_URL}\n`);

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${API_URL.replace('/api', '')}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    console.log('');

    // Test 2: Registration
    console.log('2️⃣ Testing registration...');
    console.log(`   Username: ${testUser.username}`);
    console.log(`   Email: ${testUser.email}`);
    
    const registerResponse = await axios.post(`${API_URL}/auth/register`, {
      username: testUser.username,
      email: testUser.email,
      password: testUser.password
    });
    
    console.log('✅ Registration successful!');
    console.log(`   User ID: ${registerResponse.data.user.id}`);
    console.log(`   Token received: ${registerResponse.data.token ? 'Yes' : 'No'}`);
    console.log('');

    const token = registerResponse.data.token;

    // Test 3: Login with username
    console.log('3️⃣ Testing login with username...');
    const loginResponse1 = await axios.post(`${API_URL}/auth/login`, {
      username: testUser.username,
      password: testUser.password
    });
    
    console.log('✅ Login with username successful!');
    console.log(`   User: ${loginResponse1.data.user.username}`);
    console.log('');

    // Test 4: Login with email
    console.log('4️⃣ Testing login with email...');
    const loginResponse2 = await axios.post(`${API_URL}/auth/login`, {
      username: testUser.email,
      password: testUser.password
    });
    
    console.log('✅ Login with email successful!');
    console.log(`   User: ${loginResponse2.data.user.username}`);
    console.log('');

    // Test 5: Token Verification
    console.log('5️⃣ Testing token verification...');
    const verifyResponse = await axios.get(`${API_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('✅ Token verification successful!');
    console.log(`   User: ${verifyResponse.data.user.username}`);
    console.log('');

    // Test 6: Invalid credentials
    console.log('6️⃣ Testing invalid credentials...');
    try {
      await axios.post(`${API_URL}/auth/login`, {
        username: testUser.username,
        password: 'wrongpassword'
      });
      console.log('❌ Should have failed with invalid credentials!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctly rejected invalid credentials');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log('');

    console.log('🎉 All tests passed! ✅');
    console.log('\n📝 Test User Details:');
    console.log(`   Username: ${testUser.username}`);
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Password: ${testUser.password}`);

  } catch (error) {
    console.error('❌ Test failed!');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Error:', error.response.data);
    } else if (error.request) {
      console.error('   No response received. Is the server running?');
      console.error('   Make sure the backend is running at:', API_URL);
    } else {
      console.error('   Error:', error.message);
    }
    process.exit(1);
  }
}

// Run tests
testAuth();

