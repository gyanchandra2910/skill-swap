const axios = require('axios');

// Test admin user activity functionality
async function testUserActivity() {
  try {
    console.log('🧪 Testing User Activity Functionality...\n');

    // First, get admin token by logging in
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

    // Get list of users first
    const usersResponse = await axios.get('http://localhost:5000/api/admin/users?page=1&limit=5', {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });

    if (!usersResponse.data.success || usersResponse.data.users.length === 0) {
      console.log('❌ No users found');
      return;
    }

    const users = usersResponse.data.users;
    console.log(`✅ Found ${users.length} users`);

    // Test activity for the first non-admin user
    const testUser = users.find(user => user.role !== 'admin') || users[0];
    console.log(`\n🔍 Testing activity for user: ${testUser.name} (${testUser.email})`);

    // Get user activity
    const activityResponse = await axios.get(
      `http://localhost:5000/api/admin/users/${testUser._id}/activity`,
      {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      }
    );

    if (activityResponse.data.success) {
      const activity = activityResponse.data.activity;
      console.log('✅ User activity retrieved successfully');
      console.log(`📊 Activity Summary:`);
      console.log(`   - Swap Requests: ${activity.swapRequests?.length || 0}`);
      console.log(`   - Feedback: ${activity.feedback?.length || 0}`);
      
      if (activity.swapRequests && activity.swapRequests.length > 0) {
        console.log('\n📝 Sample Swap Request:');
        const swap = activity.swapRequests[0];
        console.log(`   - Date: ${new Date(swap.createdAt).toLocaleDateString()}`);
        console.log(`   - Skills: ${swap.skillOffered} ↔ ${swap.skillWanted}`);
        console.log(`   - Status: ${swap.status}`);
        console.log(`   - Requester: ${swap.requesterId?.name || 'Unknown'}`);
        console.log(`   - Receiver: ${swap.receiverId?.name || 'Unknown'}`);
      }

      if (activity.feedback && activity.feedback.length > 0) {
        console.log('\n⭐ Sample Feedback:');
        const feedback = activity.feedback[0];
        console.log(`   - Date: ${new Date(feedback.createdAt).toLocaleDateString()}`);
        console.log(`   - Rating: ${feedback.rating}/5`);
        console.log(`   - Comment: ${feedback.comment}`);
        console.log(`   - From: ${feedback.fromUserId?.name || 'Unknown'}`);
        console.log(`   - To: ${feedback.toUserId?.name || 'Unknown'}`);
      }

      console.log('\n✅ User activity functionality is working correctly!');
    } else {
      console.log('❌ Failed to retrieve user activity');
      console.log('Response:', activityResponse.data);
    }

  } catch (error) {
    console.error('❌ Error testing user activity:', error.response?.data || error.message);
  }
}

// Run the test
testUserActivity();
