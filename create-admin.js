// Script to create an admin user for testing
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function createAdminUser() {
  console.log('🔧 Creating Admin User...\n');

  try {
    // Register admin user
    console.log('1. Registering admin user...');
    
    const adminResponse = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Admin User',
      email: 'admin@skillswap.com',
      password: 'admin123',
      skillsOffered: ['System Administration', 'User Management'],
      skillsWanted: ['Community Building'],
      location: 'Platform HQ'
    });

    const adminId = adminResponse.data.user._id;
    console.log('✅ Admin user created with ID:', adminId);

    // Need to manually update the user role to admin in MongoDB
    console.log('\n⚠️  IMPORTANT: You need to manually update the user role to "admin" in MongoDB');
    console.log('Run this MongoDB command:');
    console.log(`db.users.updateOne({_id: ObjectId("${adminId}")}, {$set: {role: "admin"}})`);
    console.log('\nOr use this script in MongoDB shell:');
    console.log(`use your_database_name;`);
    console.log(`db.users.updateOne({email: "admin@skillswap.com"}, {$set: {role: "admin"}});`);
    
    console.log('\n📧 Admin Credentials:');
    console.log('Email: admin@skillswap.com');
    console.log('Password: admin123');
    
    console.log('\n🎯 After updating the role, you can:');
    console.log('1. Login with admin credentials');
    console.log('2. Access /admin route for admin dashboard');
    console.log('3. Manage users, view stats, download reports');

  } catch (error) {
    if (error.response?.data?.message?.includes('User with this email already exists')) {
      console.log('✅ Admin user already exists!');
      console.log('\n📧 Admin Credentials:');
      console.log('Email: admin@skillswap.com');
      console.log('Password: admin123');
      console.log('\n⚠️  Make sure the user role is set to "admin" in MongoDB');
    } else {
      console.error('❌ Error creating admin user:', error.response?.data || error.message);
    }
  }
}

// Run the script
if (require.main === module) {
  createAdminUser();
}

module.exports = { createAdminUser };
