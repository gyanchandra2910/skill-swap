const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test users
const alice = {
  email: 'alice@example.com',
  password: 'password123'
};

const bob = {
  email: 'bob@example.com', 
  password: 'password123'
};

async function loginUser(userData) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, userData);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    throw error;
  }
}

async function sendSwapRequest(receiverId, skillOffered, skillWanted, token) {
  const response = await axios.post(`${BASE_URL}/swaps`, {
    receiverId,
    skillOffered,
    skillWanted,
    message: 'Hi! Let\'s exchange skills! 🚀'
  }, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

async function acceptSwapRequest(requestId, token) {
  const response = await axios.put(`${BASE_URL}/swaps/${requestId}/accept`, {}, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

async function rejectSwapRequest(requestId, token, reason) {
  const response = await axios.put(`${BASE_URL}/swaps/${requestId}/reject`, {
    reason
  }, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

async function getSwapRequests(token) {
  const response = await axios.get(`${BASE_URL}/swaps`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

async function testRealTimeNotifications() {
  try {
    console.log('🎯 Testing Real-Time Notification System...\n');

    // Login both users
    console.log('1. Logging in test users...');
    const aliceAuth = await loginUser(alice);
    const bobAuth = await loginUser(bob);
    
    console.log(`✅ Alice logged in: ${aliceAuth.user._id}`);
    console.log(`✅ Bob logged in: ${bobAuth.user._id}\n`);

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Alice sends swap request to Bob
    console.log('2. Alice sending swap request to Bob...');
    const swapRequest = await sendSwapRequest(
      bobAuth.user._id,
      'React Development',
      'Python Data Science',
      aliceAuth.token
    );
    console.log(`✅ Swap request sent: ${swapRequest.swapRequest._id}`);
    console.log('   📱 Bob should receive a real-time notification!\n');

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get Bob's incoming requests
    console.log('3. Checking Bob\'s incoming requests...');
    const bobRequests = await getSwapRequests(bobAuth.token);
    if (bobRequests.swapRequests.incoming.length > 0) {
      const latestRequest = bobRequests.swapRequests.incoming[0];
      console.log(`✅ Bob has ${bobRequests.swapRequests.incoming.length} incoming request(s)`);
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Bob accepts the request
      console.log('\n4. Bob accepting the swap request...');
      await acceptSwapRequest(latestRequest._id, bobAuth.token);
      console.log('✅ Request accepted!');
      console.log('   📱 Alice should receive acceptance notification!\n');

    } else {
      console.log('❌ No incoming requests found for Bob\n');
    }

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Send another request for rejection test
    console.log('5. Alice sending another swap request...');
    const swapRequest2 = await sendSwapRequest(
      bobAuth.user._id,
      'JavaScript',
      'Machine Learning',
      aliceAuth.token
    );
    console.log(`✅ Second swap request sent: ${swapRequest2.swapRequest._id}`);
    console.log('   📱 Bob should receive another notification!\n');

    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Bob rejects this one
    console.log('6. Bob rejecting the second request...');
    await rejectSwapRequest(
      swapRequest2.swapRequest._id, 
      bobAuth.token, 
      'Sorry, I\'m not interested in JavaScript right now.'
    );
    console.log('✅ Request rejected!');
    console.log('   📱 Alice should receive rejection notification!\n');

    console.log('🎉 Real-time notification test completed!');
    console.log('\n📋 What you should see in the browser:');
    console.log('   1. Login as Bob (bob@example.com)');
    console.log('   2. Go to Dashboard');
    console.log('   3. You should see toast notifications when requests are sent');
    console.log('   4. The dashboard should auto-refresh when events occur');
    console.log('   5. Check the real-time connection status badge');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testRealTimeNotifications();
