const mongoose = require('mongoose');
const User = require('./models/User');
const Feedback = require('./models/Feedback');

mongoose.connect('mongodb://localhost:27017/skillswap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkFeedbackInDB() {
  try {
    const feedback = await Feedback.find({})
      .populate('fromUserId', 'name')
      .populate('toUserId', 'name');
    
    console.log(`Total feedback entries: ${feedback.length}`);
    
    feedback.forEach((fb, index) => {
      console.log(`\nFeedback ${index + 1}:`);
      console.log(`  From: ${fb.fromUserId?.name || 'Unknown'} (${fb.fromUserId?._id})`);
      console.log(`  To: ${fb.toUserId?.name || 'Unknown'} (${fb.toUserId?._id})`);
      console.log(`  Rating: ${fb.rating}/5`);
      console.log(`  Comment: "${fb.comment}"`);
      console.log(`  swapId: ${fb.swapId}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkFeedbackInDB();
