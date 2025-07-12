const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Feedback = require('./models/Feedback');
const SwapRequest = require('./models/SwapRequest');

mongoose.connect('mongodb://localhost:27017/skill-swap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createSimpleTestData() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Feedback.deleteMany({});
    await SwapRequest.deleteMany({});
    
    console.log('Creating test users...');
    
    // Create test users
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const users = [
      {
        name: 'John Teacher',
        email: 'john@example.com',
        password: hashedPassword,
        skillsOffered: ['JavaScript', 'React', 'Node.js'],
        skillsWanted: ['Python', 'Machine Learning'],
        location: 'New York',
        availability: 'available'
      },
      {
        name: 'Jane Student',
        email: 'jane@example.com',
        password: hashedPassword,
        skillsOffered: ['Python', 'Data Science'],
        skillsWanted: ['JavaScript', 'Web Development'],
        location: 'California',
        availability: 'available'
      },
      {
        name: 'Mike Expert',
        email: 'mike@example.com',
        password: hashedPassword,
        skillsOffered: ['Machine Learning', 'AI', 'Data Analysis'],
        skillsWanted: ['React', 'Frontend Development'],
        location: 'Texas',
        availability: 'busy'
      },
      {
        name: 'Sarah Designer',
        email: 'sarah@example.com',
        password: hashedPassword,
        skillsOffered: ['UI/UX Design', 'Figma', 'Adobe Creative Suite'],
        skillsWanted: ['HTML', 'CSS', 'JavaScript'],
        location: 'Florida',
        availability: 'available'
      },
      {
        name: 'Alex Developer',
        email: 'alex@example.com',
        password: hashedPassword,
        skillsOffered: ['Full Stack Development', 'Docker', 'DevOps'],
        skillsWanted: ['Mobile Development', 'Flutter'],
        location: 'Washington',
        availability: 'available'
      }
    ];
    
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);
    
    // Create some swap requests first
    console.log('Creating swap requests...');
    const swapRequests = [
      {
        requesterId: createdUsers[0]._id, // John
        receiverId: createdUsers[1]._id,   // Jane
        skillOffered: 'JavaScript',
        skillWanted: 'Python',
        status: 'completed',
        message: 'Would love to learn Python from you!',
        completedAt: new Date(),
        requesterCompleted: true,
        receiverCompleted: true
      },
      {
        requesterId: createdUsers[1]._id, // Jane
        receiverId: createdUsers[2]._id,   // Mike
        skillOffered: 'Data Science',
        skillWanted: 'Machine Learning',
        status: 'completed',
        message: 'Interested in advanced ML techniques',
        completedAt: new Date(),
        requesterCompleted: true,
        receiverCompleted: true
      },
      {
        requesterId: createdUsers[3]._id, // Sarah
        receiverId: createdUsers[4]._id,   // Alex
        skillOffered: 'UI/UX Design',
        skillWanted: 'Full Stack Development',
        status: 'completed',
        message: 'Need help with full stack development',
        completedAt: new Date(),
        requesterCompleted: true,
        receiverCompleted: true
      }
    ];
    
    const createdSwaps = await SwapRequest.insertMany(swapRequests);
    console.log(`Created ${createdSwaps.length} swap requests`);
    
    // Create feedback
    console.log('Creating feedback...');
    const feedback = [
      {
        fromUserId: createdUsers[1]._id, // Jane giving feedback to John
        toUserId: createdUsers[0]._id,
        swapId: createdSwaps[0]._id,
        rating: 5,
        comment: 'Excellent teacher! John explained JavaScript concepts very clearly and was very patient with all my questions. Highly recommend!',
        isPublic: true
      },
      {
        fromUserId: createdUsers[0]._id, // John giving feedback to Jane
        toUserId: createdUsers[1]._id,
        swapId: createdSwaps[0]._id,
        rating: 4,
        comment: 'Great Python session with Jane. She has solid knowledge and good teaching skills. Would swap again!',
        isPublic: true
      },
      {
        fromUserId: createdUsers[2]._id, // Mike giving feedback to Jane
        toUserId: createdUsers[1]._id,
        swapId: createdSwaps[1]._id,
        rating: 5,
        comment: 'Jane has excellent data science fundamentals. Very organized and professional. Great learning experience!',
        isPublic: true
      },
      {
        fromUserId: createdUsers[4]._id, // Alex giving feedback to Sarah
        toUserId: createdUsers[3]._id,
        swapId: createdSwaps[2]._id,
        rating: 5,
        comment: 'Amazing design skills! Sarah helped me understand UI/UX principles that I can apply to my development work. Fantastic teacher!',
        isPublic: true
      }
    ];
    
    const createdFeedback = await Feedback.insertMany(feedback);
    console.log(`Created ${createdFeedback.length} feedback entries`);
    
    console.log('\n=== Test data created successfully! ===');
    console.log('Users you can search for:');
    createdUsers.forEach(user => {
      console.log(`- ${user.name} (teaches: ${user.skillsOffered.join(', ')})`);
    });
    
    console.log('\nUsers with feedback (search for these to test):');
    console.log('- John Teacher (1 review) - search for "JavaScript" skill');
    console.log('- Jane Student (2 reviews) - search for "Python" skill');
    console.log('- Sarah Designer (1 review) - search for "UI/UX" skill');
    
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    mongoose.connection.close();
  }
}

createSimpleTestData();
