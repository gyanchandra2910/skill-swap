const axios = require('axios');

async function testFeedbackAPI() {
  try {
    // Test with Jane Student who should have 2 reviews
    const janeId = '68723804e800bef06310be74'; // From the previous output
    
    console.log(`Testing feedback API for Jane Student (${janeId})`);
    
    const response = await axios.get(`http://localhost:5000/api/feedback/${janeId}`);
    
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log(`\nFeedback count: ${response.data.feedback.length}`);
      console.log(`Average rating: ${response.data.averageRating}`);
      console.log(`Total reviews: ${response.data.totalReviews}`);
      
      response.data.feedback.forEach((fb, index) => {
        console.log(`\nFeedback ${index + 1}:`);
        console.log(`  From: ${fb.fromUserId?.name || 'Unknown'}`);
        console.log(`  Rating: ${fb.rating}/5`);
        console.log(`  Comment: "${fb.comment}"`);
      });
    }
    
  } catch (error) {
    console.error('Error testing feedback API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testFeedbackAPI();
