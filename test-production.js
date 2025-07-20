const axios = require('axios');

async function testProductionAdmin() {
  try {
    console.log('🧪 Testing production admin user...');
    
    // Replace this with your actual Railway deployment URL
    const baseURL = 'https://skill-swap-production.up.railway.app'; // Your Railway URL
    
    console.log('🌐 Testing deployed app at:', baseURL);
    
    // Test 1: Check admin user exists in production database
    console.log('\n1️⃣ Checking if admin user exists in production...');
    try {
      const checkResponse = await axios.get(`${baseURL}/api/debug/admin-check`);
      console.log('✅ Admin check response:', checkResponse.data);
    } catch (error) {
      console.log('❌ Admin check failed:', error.response?.data || error.message);
    }
    
    // Test 2: Test production login endpoint
    console.log('\n2️⃣ Testing production login...');
    try {
      const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
        email: 'thesiliconsavants@gmail.com',
        password: 'Gyan123@'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('✅ Login successful:', {
        success: loginResponse.data.success,
        message: loginResponse.data.message,
        hasToken: !!loginResponse.data.token,
        userRole: loginResponse.data.user?.role
      });
    } catch (error) {
      console.log('❌ Login failed:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    }

    // Test 3: Test health endpoint
    console.log('\n3️⃣ Testing health endpoint...');
    try {
      const healthResponse = await axios.get(`${baseURL}/health`);
      console.log('✅ Health check:', healthResponse.data);
    } catch (error) {
      console.log('❌ Health check failed:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testProductionAdmin();
