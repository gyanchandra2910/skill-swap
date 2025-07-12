const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Feedback = require('./models/Feedback');

const app = express();

mongoose.connect('mongodb://localhost:27017/skillswap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Test route for debugging feedback
app.get('/test-feedback/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Testing feedback for userId:', userId);
    console.log('userId type:', typeof userId);
    
    // Convert to ObjectId for testing
    const objectId = new mongoose.Types.ObjectId(userId);
    console.log('ObjectId:', objectId);
    
    // Test different queries
    const query1 = await Feedback.find({ toUserId: userId });
    console.log('Query with string userId found:', query1.length);
    
    const query2 = await Feedback.find({ toUserId: objectId });
    console.log('Query with ObjectId found:', query2.length);
    
    const query3 = await Feedback.find({ toUserId: userId, isPublic: true });
    console.log('Query with string userId + isPublic found:', query3.length);
    
    const query4 = await Feedback.find({ toUserId: objectId, isPublic: true });
    console.log('Query with ObjectId + isPublic found:', query4.length);
    
    // Check what's actually in the database
    const allFeedback = await Feedback.find({});
    console.log('All feedback in database:');
    allFeedback.forEach((fb, index) => {
      console.log(`  ${index + 1}. toUserId: ${fb.toUserId} (type: ${typeof fb.toUserId})`);
      console.log(`     isPublic: ${fb.isPublic}`);
    });
    
    res.json({
      userId,
      objectId,
      results: {
        stringQuery: query1.length,
        objectIdQuery: query2.length,
        stringQueryPublic: query3.length,
        objectIdQueryPublic: query4.length
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const port = 3001;
app.listen(port, () => {
  console.log(`Debug server running on port ${port}`);
});

setTimeout(() => {
  console.log('Debug server shutting down...');
  process.exit(0);
}, 30000); // Auto-shutdown after 30 seconds
