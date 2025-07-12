// Test script to verify feedback/rating system
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test feedback submission
async function testFeedbackSystem() {
  console.log('🧪 Testing Feedback System...\n');

  try {
    // First, register two test users
    console.log('1. Creating test users...');
    
    const user1Response = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'John Teacher',
      email: `john.teacher.${Date.now()}@test.com`,
      password: 'password123',
      skillsOffered: ['JavaScript', 'React'],
      skillsWanted: ['Python'],
      location: 'New York, NY'
    });

    const user2Response = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Jane Student',
      email: `jane.student.${Date.now()}@test.com`, 
      password: 'password123',
      skillsOffered: ['Python'],
      skillsWanted: ['JavaScript'],
      location: 'New York, NY'
    });

    const user1Token = user1Response.data.token;
    const user2Token = user2Response.data.token;
    const user1Id = user1Response.data.user._id;
    const user2Id = user2Response.data.user._id;

    console.log('✅ Users created successfully');

    // 2. Send a swap request
    console.log('2. Sending swap request...');
    const swapResponse = await axios.post(`${BASE_URL}/swaps`, {
      receiverId: user2Id,
      skillOffered: 'JavaScript',
      skillWanted: 'Python',
      message: 'I would love to learn Python from you!'
    }, {
      headers: { 'Authorization': `Bearer ${user1Token}` }
    });

    const swapId = swapResponse.data.swapRequest._id;
    console.log('✅ Swap request sent');

    // 3. Accept the swap request
    console.log('3. Accepting swap request...');
    await axios.put(`${BASE_URL}/swaps/${swapId}/accept`, {}, {
      headers: { 'Authorization': `Bearer ${user2Token}` }
    });

    console.log('✅ Swap request accepted');

    // 4. Submit feedback from user 1 to user 2
    console.log('4. Submitting feedback...');
    const feedbackResponse = await axios.post(`${BASE_URL}/feedback`, {
      toUserId: user2Id,
      swapId: swapId,
      rating: 5,
      comment: 'Excellent teacher! Very patient and knowledgeable about Python. Highly recommend!'
    }, {
      headers: { 'Authorization': `Bearer ${user1Token}` }
    });

    console.log('✅ Feedback submitted successfully');

    // 5. Get feedback for user 2
    console.log('5. Retrieving user feedback...');
    const userFeedbackResponse = await axios.get(`${BASE_URL}/feedback/${user2Id}`);
    
    console.log('✅ Feedback retrieved:');
    console.log(`   Average Rating: ${userFeedbackResponse.data.averageRating}`);
    console.log(`   Total Reviews: ${userFeedbackResponse.data.totalReviews}`);
    console.log(`   Latest Review: "${userFeedbackResponse.data.feedback[0].comment}"`);

    // 6. Test user search
    console.log('6. Testing user search...');
    const searchResponse = await axios.get(`${BASE_URL}/users/search?skill=Python`);
    console.log(`✅ Found ${searchResponse.data.users.length} users with Python skills`);

    console.log('\n🎉 All tests passed! Feedback system is working correctly.');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ User registration');
    console.log('   ✅ Swap request creation');
    console.log('   ✅ Swap request acceptance');
    console.log('   ✅ Feedback submission');
    console.log('   ✅ Feedback retrieval');
    console.log('   ✅ User search');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
if (require.main === module) {
  testFeedbackSystem();
}

module.exports = { testFeedbackSystem };
