const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testLogin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find user with password
    const user = await User.findOne({ email: 'thesiliconsavants@gmail.com' }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('👤 User found:');
    console.log('📧 Email:', user.email);
    console.log('🔑 Role:', user.role);
    console.log('🔒 Password hash exists:', !!user.password);

    // Test comparePassword method
    const testPassword = 'Gyan123@';
    console.log('\n🧪 Testing password comparison...');
    console.log('🔑 Test password:', testPassword);
    
    const isValid = await user.comparePassword(testPassword);
    console.log('✅ Password comparison result:', isValid);

    if (isValid) {
      console.log('🎉 PASSWORD IS CORRECT! Login should work!');
    } else {
      console.log('❌ Password does not match');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

testLogin();
