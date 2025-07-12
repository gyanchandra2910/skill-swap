const axios = require('axios');

// Test script to verify feedback endpoint
async function testFeedbackEndpoint() {
  try {
    console.log('Testing feedback endpoint...');
    
    // First, let's get all users to find one with potential feedback
    const usersResponse = await axios.get('http://localhost:5000/api/users/search?skill=javascript');
    console.log('Users found:', usersResponse.data.users?.length || 0);
    
    if (usersResponse.data.users && usersResponse.data.users.length > 0) {
      const testUser = usersResponse.data.users[0];
      console.log('Testing feedback for user:', testUser.name, testUser._id);
      
      // Test the feedback endpoint
      const feedbackResponse = await axios.get(`http://localhost:5000/api/feedback/${testUser._id}`);
      console.log('Feedback response:', {
        success: feedbackResponse.data.success,
        feedbackCount: feedbackResponse.data.feedback?.length || 0,
        averageRating: feedbackResponse.data.averageRating,
        totalReviews: feedbackResponse.data.totalReviews
      });
      
      if (feedbackResponse.data.feedback && feedbackResponse.data.feedback.length > 0) {
        console.log('Sample feedback:', feedbackResponse.data.feedback[0]);
      } else {
        console.log('No feedback found for this user');
      }
    }
    
  } catch (error) {
    console.error('Error testing feedback endpoint:', error.response?.data || error.message);
  }
}

testFeedbackEndpoint();
