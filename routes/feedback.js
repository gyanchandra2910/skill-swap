const express = require('express');
const Feedback = require('../models/Feedback');
const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/feedback
// @desc    Create feedback for a completed swap
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { toUserId, swapId, rating, comment } = req.body;

    // Validation
    if (!toUserId || !swapId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: toUserId, swapId, rating, comment'
      });
    }

    // Validate rating
    if (rating < 1 || rating > 5 || !Number.isInteger(Number(rating))) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5'
      });
    }

    // Check if swap exists and is accepted or completed
    const swap = await SwapRequest.findById(swapId);
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    if (swap.status !== 'accepted' && swap.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only provide feedback for accepted or completed swaps'
      });
    }

    // Check if user is part of this swap
    const userId = req.user._id.toString();
    if (swap.requesterId.toString() !== userId && swap.receiverId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only provide feedback for your own swaps'
      });
    }

    // Check if feedback recipient is the other party in the swap
    const otherPartyId = swap.requesterId.toString() === userId ? 
      swap.receiverId.toString() : swap.requesterId.toString();
    
    if (toUserId !== otherPartyId) {
      return res.status(400).json({
        success: false,
        message: 'Feedback must be for the other party in the swap'
      });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({
      fromUserId: userId,
      toUserId,
      swapId
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'Feedback already provided for this swap'
      });
    }

    // Create feedback
    const feedback = new Feedback({
      fromUserId: userId,
      toUserId,
      swapId,
      rating: Number(rating),
      comment: comment.trim()
    });

    await feedback.save();
    await feedback.populateUsers();

    // Emit socket event for real-time notification
    if (req.io) {
      req.io.to(toUserId).emit('feedback_received', {
        type: 'new_feedback',
        data: {
          id: feedback._id,
          from: feedback.fromUserId.name,
          rating: feedback.rating,
          comment: feedback.comment,
          swapId: feedback.swapId._id
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback
    });

  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating feedback'
    });
  }
});

// @route   GET /api/feedback/:userId
// @desc    Get feedback for a specific user
// @access  Public
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get feedback with pagination
    const [feedbacks, totalCount, stats] = await Promise.all([
      Feedback.find({ toUserId: userId, isPublic: true })
        .populate('fromUserId', 'name profilePhoto')
        .populate('swapId', 'skillOffered skillWanted')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      
      Feedback.countDocuments({ toUserId: userId, isPublic: true }),
      
      Feedback.getUserStats(userId)
    ]);

    res.json({
      success: true,
      feedback: feedbacks,
      averageRating: stats.averageRating || 0,
      totalReviews: stats.totalFeedbacks || 0,
      stats,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        hasNext: pageNum * limitNum < totalCount,
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching feedback'
    });
  }
});

// @route   GET /api/feedback/swap/:swapId
// @desc    Get feedback for a specific swap
// @access  Private
router.get('/swap/:swapId', authenticate, async (req, res) => {
  try {
    const { swapId } = req.params;
    const userId = req.user._id.toString();

    // Check if user is part of this swap
    const swap = await SwapRequest.findById(swapId);
    if (!swap) {
      return res.status(404).json({
        success: false,
        message: 'Swap not found'
      });
    }

    if (swap.requesterId.toString() !== userId && swap.receiverId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get feedback for this swap
    const feedbacks = await Feedback.find({ swapId })
      .populate('fromUserId', 'name profilePhoto')
      .populate('toUserId', 'name profilePhoto')
      .sort({ createdAt: -1 });

    // Check if current user has provided feedback
    const userFeedback = feedbacks.find(f => f.fromUserId._id.toString() === userId);
    const receivedFeedback = feedbacks.find(f => f.toUserId._id.toString() === userId);

    res.json({
      success: true,
      data: {
        feedbacks,
        userHasFeedback: !!userFeedback,
        userReceivedFeedback: !!receivedFeedback
      }
    });

  } catch (error) {
    console.error('Get swap feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching swap feedback'
    });
  }
});

// @route   PUT /api/feedback/:id
// @desc    Update feedback (only by the author)
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id.toString();

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if user is the author
    if (feedback.fromUserId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own feedback'
      });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5 || !Number.isInteger(Number(rating)))) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5'
      });
    }

    // Update feedback
    if (rating) feedback.rating = Number(rating);
    if (comment) feedback.comment = comment.trim();

    await feedback.save();
    await feedback.populateUsers();

    res.json({
      success: true,
      message: 'Feedback updated successfully',
      feedback
    });

  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating feedback'
    });
  }
});

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback (only by the author)
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if user is the author
    if (feedback.fromUserId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own feedback'
      });
    }

    await Feedback.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Feedback deleted successfully'
    });

  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting feedback'
    });
  }
});

module.exports = router;
