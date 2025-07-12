const mongoose = require('mongoose');
const User = require('./models/User');
const Feedback = require('./models/Feedback');

mongoose.connect('mongodb://localhost:27017/skillswap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testUserStatsMethod() {
  try {
    // Get Jane Student's ID
    const jane = await User.findOne({ name: 'Jane Student' });
    console.log(`Testing getUserStats for Jane: ${jane._id}`);
    
    // Test the getUserStats method directly
    const stats = await Feedback.getUserStats(jane._id);
    console.log('Stats from getUserStats method:', stats);
    
    // Also test with string ID
    const statsWithString = await Feedback.getUserStats(jane._id.toString());
    console.log('Stats with string ID:', statsWithString);
    
    // Test direct query
    const feedbacks = await Feedback.find({ toUserId: jane._id, isPublic: true })
      .populate('fromUserId', 'name profilePhoto')
      .populate('swapId', 'skillOffered skillWanted');
    
    console.log(`\nDirect feedback query found ${feedbacks.length} entries:`);
    feedbacks.forEach((fb, index) => {
      console.log(`  ${index + 1}. From: ${fb.fromUserId?.name}, Rating: ${fb.rating}/5`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testUserStatsMethod();
