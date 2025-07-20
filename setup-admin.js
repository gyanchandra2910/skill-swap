const mongoose = require('mongoose');
const readline = require('readline');
const User = require('./models/User');
const { sendAdminWelcomeEmail } = require('./utils/emailService');
require('dotenv').config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupFirstAdmin() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Check if there are any existing admins
    const existingAdmins = await User.countDocuments({ role: 'admin' });
    
    if (existingAdmins > 0) {
      console.log(`\n✅ Found ${existingAdmins} existing admin(s).`);
      
      const listAdmins = await askQuestion('Do you want to see existing admins? (y/n): ');
      if (listAdmins.toLowerCase() === 'y') {
        const admins = await User.find({ role: 'admin' }).select('name email createdAt');
        console.log('\n📋 Existing Admins:');
        admins.forEach((admin, index) => {
          console.log(`${index + 1}. ${admin.name} (${admin.email}) - Created: ${admin.createdAt.toLocaleDateString()}`);
        });
      }
      
      const addAnother = await askQuestion('\nDo you want to add another admin? (y/n): ');
      if (addAnother.toLowerCase() !== 'y') {
        console.log('Setup cancelled.');
        process.exit(0);
      }
    }

    console.log('\n🔧 Setting up admin user...\n');

    // Get admin email
    const adminEmail = await askQuestion('Enter admin email address: ');
    
    if (!adminEmail || !adminEmail.includes('@')) {
      console.log('❌ Invalid email address provided.');
      process.exit(1);
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: adminEmail.toLowerCase() });
    
    if (!existingUser) {
      console.log('❌ User with this email does not exist.');
      console.log('💡 The user must register on the platform first before being promoted to admin.');
      
      const createUser = await askQuestion('Do you want to create a new user account? (y/n): ');
      if (createUser.toLowerCase() === 'y') {
        const name = await askQuestion('Enter full name: ');
        const password = await askQuestion('Enter password (min 6 characters): ');
        
        if (password.length < 6) {
          console.log('❌ Password must be at least 6 characters long.');
          process.exit(1);
        }

        const newUser = new User({
          name: name.trim(),
          email: adminEmail.toLowerCase(),
          password: password, // Will be hashed automatically by the model
          role: 'admin',
          skillsOffered: [],
          skillsWanted: []
        });

        await newUser.save();
        console.log(`✅ New admin user created: ${name} (${adminEmail})`);

        // Send welcome email
        try {
          await sendAdminWelcomeEmail(adminEmail, name);
          console.log('📧 Admin welcome email sent successfully!');
        } catch (emailError) {
          console.log('⚠️  Admin created but welcome email failed to send.');
          console.log('   Please check your email configuration in .env file.');
          console.log('   Error:', emailError.message);
        }
      } else {
        console.log('Setup cancelled. Please ask the user to register first.');
      }
      
      process.exit(0);
    }

    if (existingUser.role === 'admin') {
      console.log('ℹ️  This user is already an admin.');
      process.exit(0);
    }

    // Confirm promotion
    console.log(`\n👤 Found user: ${existingUser.name} (${existingUser.email})`);
    console.log(`   Current role: ${existingUser.role}`);
    console.log(`   Member since: ${existingUser.createdAt.toLocaleDateString()}`);
    
    const confirm = await askQuestion('\nConfirm promotion to admin? (y/n): ');
    
    if (confirm.toLowerCase() !== 'y') {
      console.log('Admin setup cancelled.');
      process.exit(0);
    }

    // Promote to admin
    existingUser.role = 'admin';
    await existingUser.save();

    console.log(`\n✅ ${existingUser.name} has been promoted to admin!`);

    // Send welcome email
    try {
      await sendAdminWelcomeEmail(existingUser.email, existingUser.name);
      console.log('📧 Admin welcome email sent successfully!');
    } catch (emailError) {
      console.log('⚠️  User promoted but welcome email failed to send.');
      console.log('   Please check your email configuration in .env file.');
      console.log('   Error:', emailError.message);
    }

    // Show next steps
    console.log('\n🎉 Admin setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. The new admin can login at: http://localhost:3000/login');
    console.log('2. Access admin dashboard at: http://localhost:3000/admin');
    console.log('3. Configure email settings in .env file if not already done');
    console.log('4. Test email functionality using the admin dashboard');

  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
  } finally {
    rl.close();
    mongoose.connection.close();
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Setup interrupted by user.');
  rl.close();
  mongoose.connection.close();
  process.exit(0);
});

console.log('🔐 Skill Swap - Admin Setup Tool');
console.log('==================================');

setupFirstAdmin();
