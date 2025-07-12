const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/skill-swap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function getCurrentUserIds() {
  try {
    const users = await User.find({}).select('name _id');
    console.log('Current users in database:');
    users.forEach(user => {
      console.log(`- ${user.name}: ${user._id}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

getCurrentUserIds();
