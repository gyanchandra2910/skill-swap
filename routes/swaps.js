const express = require('express');
const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const emailService = require('../utils/emailService');

const router = express.Router();

// @route   POST /api/swaps
// @desc    Send a swap request
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      receiverId,
      skillOffered,
      skillWanted,
      message
    } = req.body;

    // Validation
    if (!receiverId || !skillOffered || !skillWanted) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID, skill offered, and skill wanted are required'
      });
    }

    // Check if receiver exists and has public profile
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    if (!receiver.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Cannot send request to private profile'
      });
    }

    // Prevent self-requests
    if (req.user._id.toString() === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send swap request to yourself'
      });
    }

    // Check for existing pending request
    const existingRequest = await SwapRequest.findOne({
      requesterId: req.user._id,
      receiverId,
      skillOffered,
      skillWanted,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request for this skill swap'
      });
    }

    // Create swap request
    const swapRequest = new SwapRequest({
      requesterId: req.user._id,
      receiverId,
      skillOffered,
      skillWanted,
      message: message || ''
    });

    await swapRequest.save();

    // Send email notification to receiver
    try {
      await emailService.sendSwapRequestEmail(
        receiver.email,
        receiver.name,
        req.user.name,
        skillOffered,
        skillWanted,
        message
      );
      console.log(`Swap request email sent to ${receiver.email}`);
    } catch (emailError) {
      console.error('Error sending swap request email:', emailError);
      // Don't fail the request if email fails
    }

    // Populate user details for response
    await swapRequest.populateUsers();

    // Emit socket event to receiver for real-time notification
    if (req.io) {
      req.io.to(receiverId).emit('swap_request', {
        type: 'new_request',
        data: {
          id: swapRequest._id,
          from: swapRequest.requesterId.name,
          skillOffered: swapRequest.skillOffered,
          skillWanted: swapRequest.skillWanted,
          message: swapRequest.message,
          createdAt: swapRequest.createdAt
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Swap request sent successfully',
      swapRequest
    });

  } catch (error) {
    console.error('Send swap request error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending request for this skill swap'
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while sending swap request'
    });
  }
});

// @route   PUT /api/swaps/:id/accept
// @desc    Accept a swap request
// @access  Private
router.put('/:id/accept', authenticate, async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is the receiver
    if (swapRequest.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only accept requests sent to you'
      });
    }

    // Check if request is still pending
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request has already been ${swapRequest.status}`
      });
    }

    // Update request status
    swapRequest.status = 'accepted';
    swapRequest.acceptedAt = new Date();
    await swapRequest.save();

    // Populate user details for response
    await swapRequest.populateUsers();

    // Emit socket event to requester for real-time notification
    if (req.io) {
      req.io.to(swapRequest.requesterId._id.toString()).emit('swap_request', {
        type: 'request_accepted',
        data: {
          id: swapRequest._id,
          acceptedBy: swapRequest.receiverId.name,
          skillOffered: swapRequest.skillOffered,
          skillWanted: swapRequest.skillWanted,
          acceptedAt: swapRequest.acceptedAt
        }
      });
    }

    res.json({
      success: true,
      message: 'Swap request accepted',
      swapRequest
    });

  } catch (error) {
    console.error('Accept swap request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while accepting swap request'
    });
  }
});

// @route   PUT /api/swaps/:id/reject
// @desc    Reject a swap request
// @access  Private
router.put('/:id/reject', authenticate, async (req, res) => {
  try {
    const { reason } = req.body;

    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is the receiver
    if (swapRequest.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only reject requests sent to you'
      });
    }

    // Check if request is still pending
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request has already been ${swapRequest.status}`
      });
    }

    // Update request status
    swapRequest.status = 'rejected';
    swapRequest.rejectedAt = new Date();
    if (reason) {
      swapRequest.message = `${swapRequest.message}\n\nRejection reason: ${reason}`;
    }
    await swapRequest.save();

    // Populate user details for response
    await swapRequest.populateUsers();

    // Emit socket event to requester for real-time notification
    if (req.io) {
      req.io.to(swapRequest.requesterId._id.toString()).emit('swap_request', {
        type: 'request_rejected',
        data: {
          id: swapRequest._id,
          rejectedBy: swapRequest.receiverId.name,
          skillOffered: swapRequest.skillOffered,
          skillWanted: swapRequest.skillWanted,
          reason: reason || 'No reason provided',
          rejectedAt: swapRequest.rejectedAt
        }
      });
    }

    res.json({
      success: true,
      message: 'Swap request rejected',
      swapRequest
    });

  } catch (error) {
    console.error('Reject swap request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting swap request'
    });
  }
});

// @route   GET /api/swaps
// @desc    Get user's swap requests (incoming and outgoing)
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { 
      type = 'all', // 'incoming', 'outgoing', 'all'
      status = 'all', // 'pending', 'accepted', 'rejected', 'all'
      page = 1,
      limit = 10
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = {};
    
    // Filter by type
    if (type === 'incoming') {
      query.receiverId = req.user._id;
    } else if (type === 'outgoing') {
      query.requesterId = req.user._id;
    } else {
      query.$or = [
        { receiverId: req.user._id },
        { requesterId: req.user._id }
      ];
    }

    // Filter by status
    if (status !== 'all') {
      query.status = status;
    }

    const [requests, totalCount] = await Promise.all([
      SwapRequest.find(query)
        .populate('requesterId', 'name email profilePhoto skillsOffered skillsWanted location availability')
        .populate('receiverId', 'name email profilePhoto skillsOffered skillsWanted location availability')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      
      SwapRequest.countDocuments(query)
    ]);

    const userId = req.user._id.toString();
    
    // Separate incoming and outgoing for easier frontend handling
    const incoming = requests.filter(request => request.receiverId._id.toString() === userId);
    const outgoing = requests.filter(request => request.requesterId._id.toString() === userId);

    res.json({
      success: true,
      swapRequests: {
        incoming,
        outgoing
      },
      data: {
        incoming,
        outgoing,
        all: requests
      },
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalCount,
        hasNext: pageNum * limitNum < totalCount,
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Get swap requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching swap requests'
    });
  }
});

// @route   GET /api/swaps/:id
// @desc    Get a specific swap request
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id)
      .populate('requesterId', 'name email profilePhoto skillsOffered skillsWanted location availability')
      .populate('receiverId', 'name email profilePhoto skillsOffered skillsWanted location availability');

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is involved in this request
    const userId = req.user._id.toString();
    if (swapRequest.requesterId._id.toString() !== userId && 
        swapRequest.receiverId._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      swapRequest
    });

  } catch (error) {
    console.error('Get swap request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching swap request'
    });
  }
});

// @route   DELETE /api/swaps/:id
// @desc    Cancel/Delete a swap request (only by requester and only if pending)
// @access  Private
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const swapRequest = await SwapRequest.findById(req.params.id);

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is the requester
    if (swapRequest.requesterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own requests'
      });
    }

    // Check if request is still pending
    if (swapRequest.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Can only cancel pending requests'
      });
    }

    await SwapRequest.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Swap request cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel swap request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling swap request'
    });
  }
});

// @route   PUT /api/swaps/:id/complete
// @desc    Mark swap session as completed by user
// @access  Private
router.put('/:id/complete', authenticate, async (req, res) => {
  try {
    const { sessionSummary, sessionTime } = req.body;
    const swapId = req.params.id;
    const userId = req.user._id.toString();

    // Find the swap request
    const swapRequest = await SwapRequest.findById(swapId)
      .populate('requesterId', 'name email')
      .populate('receiverId', 'name email');

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is part of this swap
    const isRequester = swapRequest.requesterId._id.toString() === userId;
    const isReceiver = swapRequest.receiverId._id.toString() === userId;

    if (!isRequester && !isReceiver) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to complete this swap'
      });
    }

    // Check if swap is accepted
    if (swapRequest.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Can only complete accepted swap requests'
      });
    }

    // Update completion status based on who is marking it complete
    if (isRequester) {
      swapRequest.requesterCompleted = true;
    } else {
      swapRequest.receiverCompleted = true;
    }

    // Add session details if provided
    if (sessionSummary) {
      swapRequest.sessionSummary = sessionSummary;
    }
    if (sessionTime) {
      swapRequest.sessionTime = new Date(sessionTime);
    }

    // If both users have marked as completed, set status to completed
    if (swapRequest.requesterCompleted && swapRequest.receiverCompleted) {
      swapRequest.status = 'completed';
      swapRequest.completedAt = new Date();
    }

    await swapRequest.save();

    // Emit real-time notification to other user
    const otherUserId = isRequester ? swapRequest.receiverId._id : swapRequest.requesterId._id;
    const currentUserName = isRequester ? swapRequest.requesterId.name : swapRequest.receiverId.name;

    if (req.io) {
      if (swapRequest.status === 'completed') {
        // Both completed - notify completion
        req.io.to(otherUserId.toString()).emit('swap_completed', {
          swapId: swapRequest._id,
          message: `🎉 Swap session with ${currentUserName} has been completed by both parties!`,
          swap: swapRequest
        });
      } else {
        // One user completed - notify waiting for other
        req.io.to(otherUserId.toString()).emit('swap_progress', {
          swapId: swapRequest._id,
          message: `${currentUserName} has marked the swap session as completed. Please confirm when you're ready.`,
          swap: swapRequest
        });
      }
    }

    res.json({
      success: true,
      message: swapRequest.status === 'completed' 
        ? 'Swap session completed successfully!' 
        : 'Your completion has been recorded. Waiting for the other user to confirm.',
      swap: swapRequest
    });

  } catch (error) {
    console.error('Complete swap error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while completing swap'
    });
  }
});

// @route   PUT /api/swaps/:id/schedule
// @desc    Suggest/update session time for accepted swap
// @access  Private
router.put('/:id/schedule', authenticate, async (req, res) => {
  try {
    const { sessionTime, contactEmail, contactPhone } = req.body;
    const swapId = req.params.id;
    const userId = req.user._id.toString();

    // Find the swap request
    const swapRequest = await SwapRequest.findById(swapId)
      .populate('requesterId', 'name email')
      .populate('receiverId', 'name email');

    if (!swapRequest) {
      return res.status(404).json({
        success: false,
        message: 'Swap request not found'
      });
    }

    // Check if user is part of this swap
    const isRequester = swapRequest.requesterId._id.toString() === userId;
    const isReceiver = swapRequest.receiverId._id.toString() === userId;

    if (!isRequester && !isReceiver) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to schedule this swap'
      });
    }

    // Check if swap is accepted
    if (swapRequest.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Can only schedule accepted swap requests'
      });
    }

    // Update session details
    if (sessionTime) {
      swapRequest.sessionTime = new Date(sessionTime);
    }
    if (contactEmail) {
      swapRequest.contactEmail = contactEmail;
    }
    if (contactPhone) {
      swapRequest.contactPhone = contactPhone;
    }

    await swapRequest.save();

    // Emit real-time notification to other user
    const otherUserId = isRequester ? swapRequest.receiverId._id : swapRequest.requesterId._id;
    const currentUserName = isRequester ? swapRequest.requesterId.name : swapRequest.receiverId.name;

    if (req.io && sessionTime) {
      req.io.to(otherUserId.toString()).emit('swap_scheduled', {
        swapId: swapRequest._id,
        message: `📅 ${currentUserName} has suggested a session time: ${new Date(sessionTime).toLocaleString()}`,
        swap: swapRequest
      });
    }

    res.json({
      success: true,
      message: 'Session details updated successfully',
      swap: swapRequest
    });

  } catch (error) {
    console.error('Schedule swap error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while scheduling swap'
    });
  }
});

module.exports = router;
