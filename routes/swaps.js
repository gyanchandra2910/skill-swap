const express = require('express');
const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

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

    // Populate user details for response
    await swapRequest.populateUsers();

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

module.exports = router;
