require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function checkAdminAccount() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Check for the admin account
    const adminUser = await User.findOne({ email: 'thesiliconsavants@gmail.com' });
    
    if (adminUser) {
      console.log('✅ Admin account found:');
      console.log('- Name:', adminUser.name);
      console.log('- Email:', adminUser.email);
      console.log('- Role:', adminUser.role);
      console.log('- Created:', adminUser.createdAt);
      
      // Test password
      const testPassword = 'Gyan123@';
      const isPasswordValid = await bcrypt.compare(testPassword, adminUser.password);
      console.log('- Password test:', isPasswordValid ? '✅ Valid' : '❌ Invalid');
      
    } else {
      console.log('❌ Admin account not found');
      
      // List all users to see what exists
      const allUsers = await User.find({}).select('name email role createdAt');
      console.log('\n📋 All users in database:');
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAdminAccount();
