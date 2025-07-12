const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  requesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Requester ID is required']
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Receiver ID is required']
  },
  skillOffered: {
    type: String,
    required: [true, 'Skill offered is required'],
    trim: true,
    maxlength: [100, 'Skill offered cannot exceed 100 characters']
  },
  skillWanted: {
    type: String,
    required: [true, 'Skill wanted is required'],
    trim: true,
    maxlength: [100, 'Skill wanted cannot exceed 100 characters']
  },
  message: {
    type: String,
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  acceptedAt: {
    type: Date
  },
  rejectedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  requesterCompleted: {
    type: Boolean,
    default: false
  },
  receiverCompleted: {
    type: Boolean,
    default: false
  },
  sessionSummary: {
    type: String,
    trim: true,
    maxlength: [1000, 'Session summary cannot exceed 1000 characters']
  },
  sessionTime: {
    type: Date
  },
  contactEmail: {
    type: String,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
swapRequestSchema.index({ requesterId: 1, status: 1 });
swapRequestSchema.index({ receiverId: 1, status: 1 });
swapRequestSchema.index({ createdAt: -1 });

// Prevent duplicate requests between same users for same skills
swapRequestSchema.index(
  { 
    requesterId: 1, 
    receiverId: 1, 
    skillOffered: 1, 
    skillWanted: 1 
  }, 
  { 
    unique: true,
    partialFilterExpression: { status: 'pending' }
  }
);

// Instance method to populate user details
swapRequestSchema.methods.populateUsers = async function() {
  await this.populate('requesterId', 'name email profilePhoto skillsOffered skillsWanted location availability');
  await this.populate('receiverId', 'name email profilePhoto skillsOffered skillsWanted location availability');
  return this;
};

// Static method to get user's requests with pagination
swapRequestSchema.statics.getUserRequests = async function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  const [incoming, outgoing] = await Promise.all([
    this.find({ receiverId: userId })
        .populate('requesterId', 'name email profilePhoto skillsOffered skillsWanted location availability')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    
    this.find({ requesterId: userId })
        .populate('receiverId', 'name email profilePhoto skillsOffered skillsWanted location availability')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
  ]);
  
  return { incoming, outgoing };
};

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
