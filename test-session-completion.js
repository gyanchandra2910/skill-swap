const axios = require('axios');

// Test session completion functionality
async function testSessionCompletion() {
  try {
    console.log('🧪 Testing Session Completion Functionality...\n');

    // Login as admin first
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@skillswap.com',
      password: 'admin123'
    });

    if (!loginResponse.data.success) {
      console.log('❌ Admin login failed');
      return;
    }

    const adminToken = loginResponse.data.token;
    console.log('✅ Admin logged in successfully');

    // Get swap requests
    const swapsResponse = await axios.get('http://localhost:5000/api/swaps', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (!swapsResponse.data.success) {
      console.log('❌ Failed to get swaps');
      return;
    }

    console.log('✅ Retrieved swap requests');
    const swaps = swapsResponse.data.swapRequests;
    const allSwaps = [...(swaps.incoming || []), ...(swaps.outgoing || [])];
    
    if (allSwaps.length === 0) {
      console.log('ℹ️ No swaps found to test');
      return;
    }

    // Find an accepted swap to test completion
    const acceptedSwap = allSwaps.find(swap => swap.status === 'accepted');
    
    if (!acceptedSwap) {
      console.log('ℹ️ No accepted swaps found to test completion');
      
      // Create a test swap if none exists
      console.log('📝 Creating a test swap...');
      
      // Get another user to create swap with
      const usersResponse = await axios.get('http://localhost:5000/api/admin/users?limit=5', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      const testUser = usersResponse.data.users.find(u => u.role !== 'admin');
      if (!testUser) {
        console.log('❌ No test user found');
        return;
      }

      // Create swap request
      const createSwapResponse = await axios.post('http://localhost:5000/api/swaps', {
        receiverId: testUser._id,
        skillOffered: 'JavaScript',
        skillWanted: 'Python',
        message: 'Test swap for completion testing'
      }, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });

      if (createSwapResponse.data.success) {
        console.log('✅ Test swap created');
        
        // Accept the swap (as the receiver)
        // First login as the test user
        const testLoginResponse = await axios.post('http://localhost:5000/api/auth/login', {
          email: testUser.email,
          password: 'password123' // Assuming default password
        });

        if (testLoginResponse.data.success) {
          const testUserToken = testLoginResponse.data.token;
          
          const acceptResponse = await axios.put(
            `http://localhost:5000/api/swaps/${createSwapResponse.data.swapRequest._id}/accept`,
            {},
            { headers: { 'Authorization': `Bearer ${testUserToken}` } }
          );

          if (acceptResponse.data.success) {
            console.log('✅ Test swap accepted');
            
            // Now test completion
            await testCompletion(acceptResponse.data.swapRequest._id, adminToken);
          }
        }
      }
      return;
    }

    // Test completion with existing accepted swap
    await testCompletion(acceptedSwap._id, adminToken);

  } catch (error) {
    console.error('❌ Error testing session completion:', error.response?.data || error.message);
  }
}

async function testCompletion(swapId, token) {
  try {
    console.log(`\n🔄 Testing completion for swap: ${swapId}`);

    // Test scheduling first
    console.log('📅 Testing session scheduling...');
    const scheduleResponse = await axios.put(
      `http://localhost:5000/api/swaps/${swapId}/schedule`,
      {
        sessionTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        contactEmail: 'test@example.com',
        contactPhone: '+1234567890'
      },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (scheduleResponse.data.success) {
      console.log('✅ Session scheduled successfully');
    } else {
      console.log('⚠️ Schedule failed:', scheduleResponse.data.message);
    }

    // Test completion
    console.log('✅ Testing session completion...');
    const completionResponse = await axios.put(
      `http://localhost:5000/api/swaps/${swapId}/complete`,
      {
        sessionSummary: 'Great session! Learned a lot about JavaScript fundamentals.'
      },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (completionResponse.data.success) {
      console.log('✅ Session marked as completed successfully');
      console.log(`📊 Status: ${completionResponse.data.swap.status}`);
      console.log(`📝 Message: ${completionResponse.data.message}`);
      
      if (completionResponse.data.swap.sessionSummary) {
        console.log(`📝 Summary: ${completionResponse.data.swap.sessionSummary}`);
      }
      
      // Show completion status
      console.log('🔍 Completion Status:');
      console.log(`   - Requester completed: ${completionResponse.data.swap.requesterCompleted}`);
      console.log(`   - Receiver completed: ${completionResponse.data.swap.receiverCompleted}`);
      
    } else {
      console.log('❌ Completion failed:', completionResponse.data.message);
    }

  } catch (error) {
    console.error('❌ Error in completion test:', error.response?.data || error.message);
  }
}

// Run the test
testSessionCompletion();
