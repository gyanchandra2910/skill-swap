const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'thesiliconsavants@gmail.com' });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔑 Role:', existingAdmin.role);
      console.log('📅 Created:', existingAdmin.createdAt);
      
      // Update password if needed
      existingAdmin.password = 'Gyan123@';
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('🔄 Admin password updated successfully!');
    } else {
      // Create new admin user
      const adminUser = new User({
        name: 'The Silicon Savants',
        email: 'thesiliconsavants@gmail.com',
        password: 'Gyan123@',
        skills: ['Admin', 'Management', 'Full Stack Development'],
        location: 'Global',
        bio: 'Platform Administrator',
        role: 'admin'
      });

      await adminUser.save();
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n🎯 Admin Login Details:');
    console.log('📧 Email: thesiliconsavants@gmail.com');
    console.log('🔑 Password: Gyan123@');
    console.log('🌐 Login URL: https://skill-swap-production.up.railway.app');
    console.log('⚡ Admin Dashboard: https://skill-swap-production.up.railway.app/admin');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();
