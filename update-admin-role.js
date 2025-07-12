// Quick script to update user role to admin directly in MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

async function updateUserToAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Import User model
    const User = require('./models/User');

    // Update the user to admin role
    const result = await User.updateOne(
      { email: 'admin@skillswap.com' },
      { $set: { role: 'admin' } }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ User role updated to admin successfully!');
      
      // Verify the update
      const adminUser = await User.findOne({ email: 'admin@skillswap.com' });
      console.log('User details:', {
        name: adminUser.name,
        email: adminUser.email,
        role: adminUser.role
      });
    } else {
      console.log('❌ No user found with email admin@skillswap.com');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

  } catch (error) {
    console.error('Error:', error);
  }
}

updateUserToAdmin();
