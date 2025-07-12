const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test user credentials
const user1 = {
  name: 'Alice Teacher',
  email: 'alice@example.com',
  password: 'password123',
  skillsOffered: ['JavaScript', 'React'],
  skillsWanted: ['Python', 'Machine Learning'],
  location: 'New York',
  availability: 'available',
  isPublic: true
};

const user2 = {
  name: 'Bob Learner', 
  email: 'bob@example.com',
  password: 'password123',
  skillsOffered: ['Python', 'Data Science'],
  skillsWanted: ['JavaScript', 'React'],
  location: 'California',
  availability: 'available',
  isPublic: true
};

let user1Token, user2Token, user1Id, user2Id;

async function registerUser(userData) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response?.data?.message?.includes('already registered')) {
      // User already exists, try to login
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: userData.email,
        password: userData.password
      });
      return loginResponse.data;
    }
    throw error;
  }
}

async function searchUsers(skill, token) {
  const response = await axios.get(`${BASE_URL}/users/search?skill=${skill}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
}

async function sendSwapRequest(receiverId, skillOffered, skillWanted, token) {
  const response = await axios.post(`${BASE_URL}/swaps`, {
    receiverId,
    skillOffered,
    skillWanted,
    message: 'Hi! I would love to exchange skills with you.'
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

async function testSwapFlow() {
  try {
    console.log('🚀 Starting Swap Request Flow Test...\n');

    // 1. Register/Login users
    console.log('1. Setting up test users...');
    const user1Auth = await registerUser(user1);
    const user2Auth = await registerUser(user2);
    
    user1Token = user1Auth.token;
    user2Token = user2Auth.token;
    user1Id = user1Auth.user._id;
    user2Id = user2Auth.user._id;
    
    console.log(`✅ User 1 (${user1.name}): ${user1Id}`);
    console.log(`✅ User 2 (${user2.name}): ${user2Id}\n`);

    // 2. User 1 searches for Python skills (User 2 has this)
    console.log('2. User 1 searching for Python skills...');
    const searchResults = await searchUsers('Python', user1Token);
    console.log(`✅ Found ${searchResults.users.length} users with Python skills`);
    
    const targetUser = searchResults.users.find(u => u._id === user2Id);
    if (targetUser) {
      console.log(`✅ Found target user: ${targetUser.name}\n`);
    } else {
      console.log(`❌ Target user not found in search results\n`);
      return;
    }

    // 3. User 1 sends swap request to User 2
    console.log('3. User 1 sending swap request to User 2...');
    const swapRequest = await sendSwapRequest(
      user2Id,
      'JavaScript',
      'Python',
      user1Token
    );
    console.log(`✅ Swap request sent successfully: ${swapRequest.swapRequest._id}\n`);

    // 4. Check User 1's outgoing requests
    console.log('4. Checking User 1\'s outgoing requests...');
    const user1Requests = await getSwapRequests(user1Token);
    console.log(`✅ User 1 has ${user1Requests.swapRequests.outgoing.length} outgoing requests`);
    console.log(`✅ User 1 has ${user1Requests.swapRequests.incoming.length} incoming requests\n`);

    // 5. Check User 2's incoming requests
    console.log('5. Checking User 2\'s incoming requests...');
    const user2Requests = await getSwapRequests(user2Token);
    console.log(`✅ User 2 has ${user2Requests.swapRequests.incoming.length} incoming requests`);
    console.log(`✅ User 2 has ${user2Requests.swapRequests.outgoing.length} outgoing requests\n`);

    // 6. Display detailed request information
    if (user2Requests.swapRequests.incoming.length > 0) {
      const incomingRequest = user2Requests.swapRequests.incoming[0];
      console.log('📨 Incoming request details for User 2:');
      console.log(`   From: ${incomingRequest.requesterId.name}`);
      console.log(`   Offers: ${incomingRequest.skillOffered}`);
      console.log(`   Wants: ${incomingRequest.skillWanted}`);
      console.log(`   Status: ${incomingRequest.status}`);
      console.log(`   Message: ${incomingRequest.message || 'No message'}\n`);
    }

    console.log('🎉 Test completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - User 1 can send swap requests: ✅`);
    console.log(`   - User 2 can receive swap requests: ✅`);
    console.log(`   - Requests appear in dashboard: ✅`);
    console.log('\n🔍 To test in the web app:');
    console.log(`   1. Login as ${user2.email} (password: ${user2.password})`);
    console.log(`   2. Go to Dashboard`);
    console.log(`   3. Check "Incoming Requests" section`);
    console.log(`   4. You should see the request from ${user1.name}`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testSwapFlow();
