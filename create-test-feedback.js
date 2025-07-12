const axios = require('axios');

// Script to create test feedback
async function createTestFeedback() {
  try {
    // First login to get a token
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'john@example.com',
      password: 'password123'
    });
    
    if (!loginResponse.data.success) {
      console.log('Login failed, creating user first...');
      return;
    }
    
    const token = loginResponse.data.token;
    console.log('Logged in successfully');
    
    // Get all swaps
    const swapsResponse = await axios.get('http://localhost:5000/api/swaps', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Swaps found:', swapsResponse.data.swapRequests);
    
    // Find an accepted swap
    const acceptedSwaps = [
      ...swapsResponse.data.swapRequests.incoming.filter(s => s.status === 'accepted'),
      ...swapsResponse.data.swapRequests.outgoing.filter(s => s.status === 'accepted')
    ];
    
    if (acceptedSwaps.length > 0) {
      const swap = acceptedSwaps[0];
      console.log('Found accepted swap:', swap._id);
      
      // Determine the other user
      const currentUserId = loginResponse.data.user._id;
      const otherUserId = swap.requesterId._id === currentUserId ? swap.receiverId._id : swap.requesterId._id;
      
      console.log('Creating feedback for user:', otherUserId);
      
      // Create feedback
      const feedbackResponse = await axios.post('http://localhost:5000/api/feedback', {
        toUserId: otherUserId,
        swapId: swap._id,
        rating: 5,
        comment: 'Amazing skill swap experience! Very knowledgeable and patient teacher. Would definitely recommend to anyone looking to learn this skill. Great communication throughout the process.'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Feedback created:', feedbackResponse.data);
    } else {
      console.log('No accepted swaps found');
    }
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

createTestFeedback();
