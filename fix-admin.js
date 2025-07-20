const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function fixAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing admin if exists
    await User.deleteOne({ email: 'thesiliconsavants@gmail.com' });
    console.log('🗑️  Removed existing admin user');

    // Create new admin user - let the pre-save middleware handle password hashing
    const adminUser = new User({
      name: 'The Silicon Savants',
      email: 'thesiliconsavants@gmail.com',
      password: 'Gyan123@', // Raw password - will be hashed by pre-save middleware
      skillsOffered: ['Admin', 'Management', 'Full Stack Development'],
      skillsWanted: ['Community Building'],
      location: 'Global',
      bio: 'Platform Administrator',
      role: 'admin',
      profilePhoto: '',
      isVerified: true
    });

    await adminUser.save();
    console.log('✅ New admin user created!');

    // Verify the user was created correctly
    const savedAdmin = await User.findOne({ email: 'thesiliconsavants@gmail.com' }).select('+password');
    console.log('🔍 Verification:');
    console.log('📧 Email:', savedAdmin.email);
    console.log('👤 Name:', savedAdmin.name);
    console.log('🔑 Role:', savedAdmin.role);
    console.log('🔒 Password Hash Exists:', !!savedAdmin.password);
    console.log('🔒 Password Hash Length:', savedAdmin.password ? savedAdmin.password.length : 0);

    // Test password comparison
    const isMatch = await bcrypt.compare('Gyan123@', savedAdmin.password);
    console.log('✅ Password Test Result:', isMatch);

    console.log('\n🎯 Admin Login Details:');
    console.log('📧 Email: thesiliconsavants@gmail.com');
    console.log('🔑 Password: Gyan123@');
    console.log('🌐 Login URL: https://skill-swap-production.up.railway.app');
    console.log('⚡ Admin Dashboard: https://skill-swap-production.up.railway.app/admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

fixAdmin();
