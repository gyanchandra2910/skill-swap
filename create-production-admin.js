const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function createProductionAdmin() {
  try {
    // Connect to production MongoDB
    const mongoUri = process.env.MONGO_URI;
    console.log('🔗 Connecting to production MongoDB...');
    console.log('📍 MongoDB URI:', mongoUri ? mongoUri.substring(0, 30) + '...' : 'Not found');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to production MongoDB');

    const adminEmail = 'thesiliconsavants@gmail.com';
    const adminPassword = 'Gyan123@';

    // Check if admin already exists
    console.log('🔍 Checking if admin user exists...');
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', {
        email: existingAdmin.email,
        role: existingAdmin.role,
        name: existingAdmin.name,
        createdAt: existingAdmin.createdAt
      });
      
      // Update password if needed
      console.log('🔄 Updating admin password...');
      existingAdmin.password = adminPassword; // Will be hashed by pre-save middleware
      await existingAdmin.save();
      console.log('✅ Admin password updated successfully');
    } else {
      // Create new admin user
      console.log('🚀 Creating new admin user...');
      
      const adminUser = new User({
        name: 'The Silicon Savants Admin',
        email: adminEmail,
        password: adminPassword, // Will be hashed by pre-save middleware
        role: 'admin',
        location: 'India',
        skillsOffered: ['Platform Management', 'User Support', 'System Administration'],
        skillsWanted: ['User Feedback', 'Platform Enhancement Ideas'],
        availability: 'available',
        bio: 'Platform Administrator - Managing the Skill Swap platform to ensure smooth operations and user experience.',
        isEmailVerified: true
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully');
    }

    // Verify the admin user
    console.log('🔍 Verifying admin user...');
    const verifyAdmin = await User.findOne({ email: adminEmail }).select('+password');
    if (verifyAdmin) {
      const isPasswordValid = await verifyAdmin.comparePassword(adminPassword);
      console.log('✅ Admin verification:', {
        email: verifyAdmin.email,
        role: verifyAdmin.role,
        passwordValid: isPasswordValid,
        hasPassword: !!verifyAdmin.password
      });
    }

    console.log('\n🎉 Admin user is ready for production!');
    console.log('📧 Email: thesiliconsavants@gmail.com');
    console.log('🔑 Password: Gyan123@');
    console.log('🌐 You can now login to your deployed application');

  } catch (error) {
    console.error('❌ Error creating production admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

createProductionAdmin();
