const mongoose = require('mongoose');
const User = require('./models/User');
const Feedback = require('./models/Feedback');

mongoose.connect('mongodb://localhost:27017/skillswap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkUsersFeedback() {
  try {
    console.log('=== Users and their feedback ===');
    
    const users = await User.find({}).select('name skillsOffered skillsWanted');
    console.log(`Total users: ${users.length}`);
    
    for (const user of users) {
      console.log(`\n--- User: ${user.name} (${user._id}) ---`);
      console.log(`Skills offered: ${user.skillsOffered?.join(', ') || 'None'}`);
      console.log(`Skills wanted: ${user.skillsWanted?.join(', ') || 'None'}`);
      
      const feedback = await Feedback.find({ toUserId: user._id })
        .populate('fromUserId', 'name')
        .select('fromUserId rating comment');
      
      if (feedback.length > 0) {
        console.log(`Feedback received (${feedback.length}):`);
        feedback.forEach((fb, idx) => {
          console.log(`  ${idx + 1}. From: ${fb.fromUserId?.name || 'Unknown'}, Rating: ${fb.rating}/5`);
          console.log(`     Comment: "${fb.comment}"`);
        });
      } else {
        console.log('No feedback received');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkUsersFeedback();
