const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  swapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SwapRequest',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound index to ensure one feedback per user per swap
feedbackSchema.index({ fromUserId: 1, toUserId: 1, swapId: 1 }, { unique: true });

// Instance method to populate user details
feedbackSchema.methods.populateUsers = async function() {
  await this.populate('fromUserId', 'name profilePhoto');
  await this.populate('toUserId', 'name profilePhoto');
  await this.populate('swapId', 'skillOffered skillWanted status');
  return this;
};

// Static method to get user's feedback statistics
feedbackSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { toUserId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalFeedbacks: { $sum: 1 },
        ratingBreakdown: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      averageRating: 0,
      totalFeedbacks: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }

  const result = stats[0];
  
  // Count ratings by star
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  result.ratingBreakdown.forEach(rating => {
    breakdown[rating]++;
  });

  return {
    averageRating: Math.round(result.averageRating * 10) / 10, // Round to 1 decimal
    totalFeedbacks: result.totalFeedbacks,
    ratingBreakdown: breakdown
  };
};

module.exports = mongoose.model('Feedback', feedbackSchema);
