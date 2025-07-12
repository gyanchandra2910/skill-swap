const express = require('express');
const User = require('../models/User');
const SwapRequest = require('../models/SwapRequest');
const Feedback = require('../models/Feedback');
const { authenticate } = require('../middleware/auth');
const { 
  sendUserBannedEmail, 
  sendUserUnbannedEmail, 
  sendAdminWelcomeEmail,
  sendPlatformReportEmail 
} = require('../utils/emailService');

const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// @route   GET /api/admin/users
// @desc    Get all users for admin management
// @access  Private (Admin only)
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = '',
      role = 'all',
      status = 'all' // active, banned, all
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = {};

    // Search by name or email
    if (search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by role
    if (role !== 'all') {
      query.role = role;
    }

    // Filter by ban status
    if (status === 'banned') {
      query.isBanned = true;
    } else if (status === 'active') {
      query.isBanned = { $ne: true };
    }

    const [users, totalCount] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      
      User.countDocuments(query)
    ]);

    // Get additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [swapsSent, swapsReceived, feedbackGiven, feedbackReceived] = await Promise.all([
          SwapRequest.countDocuments({ requesterId: user._id }),
          SwapRequest.countDocuments({ receiverId: user._id }),
          Feedback.countDocuments({ fromUserId: user._id }),
          Feedback.countDocuments({ toUserId: user._id })
        ]);

        const feedbackStats = await Feedback.getUserStats(user._id);

        return {
          ...user.toObject(),
          stats: {
            swapsSent,
            swapsReceived,
            feedbackGiven,
            feedbackReceived,
            averageRating: feedbackStats.averageRating,
            totalReviews: feedbackStats.totalFeedbacks
          }
        };
      })
    );

    res.json({
      success: true,
      users: usersWithStats,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalCount / limitNum),
        totalUsers: totalCount,
        hasNext: pageNum * limitNum < totalCount,
        hasPrev: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// @route   PUT /api/admin/users/:id/ban
// @desc    Ban or unban a user
// @access  Private (Admin only)
router.put('/users/:id/ban', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { ban = true, reason = 'Violation of terms of service' } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent banning other admins
    if (user.role === 'admin' && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Cannot ban other administrators'
      });
    }

    // Update ban status
    user.isBanned = ban;
    user.bannedAt = ban ? new Date() : null;
    user.banReason = ban ? reason : null;

    await user.save();

    // Emit real-time notification if user is online
    if (req.io) {
      req.io.to(user._id.toString()).emit('account_status_changed', {
        type: ban ? 'banned' : 'unbanned',
        message: ban ? 
          `Your account has been banned. Reason: ${reason}` : 
          'Your account has been restored.',
        bannedAt: user.bannedAt,
        reason: user.banReason
      });
    }

    // Send email notification
    if (ban) {
      sendUserBannedEmail(user.email, user.name, reason);
    } else {
      sendUserUnbannedEmail(user.email, user.name);
    }

    res.json({
      success: true,
      message: ban ? 
        `User ${user.name} has been banned` : 
        `User ${user.name} has been unbanned`,
      user: {
        ...user.toObject(),
        password: undefined
      }
    });

  } catch (error) {
    console.error('Admin ban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user ban status'
    });
  }
});

// @route   POST /api/admin/users/:id/promote
// @desc    Promote a user to admin
// @access  Private (Admin only)
router.put('/users/:id/promote', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User is already an admin'
      });
    }

    // Promote to admin
    user.role = 'admin';
    await user.save();

    // Send welcome email to new admin
    try {
      await sendAdminWelcomeEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Failed to send admin welcome email:', emailError);
    }

    // Emit real-time notification
    if (req.io) {
      req.io.to(user._id.toString()).emit('role_changed', {
        type: 'promoted_to_admin',
        message: 'Congratulations! You have been promoted to administrator.',
        newRole: 'admin'
      });
    }

    res.json({
      success: true,
      message: `${user.name} has been promoted to admin`,
      user: {
        ...user.toObject(),
        password: undefined
      }
    });

  } catch (error) {
    console.error('Admin promote user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while promoting user'
    });
  }
});

// @route   GET /api/admin/stats
// @desc    Get platform statistics
// @access  Private (Admin only)
router.get('/stats', authenticate, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalActiveUsers,
      totalBannedUsers,
      totalSwaps,
      pendingSwaps,
      acceptedSwaps,
      totalFeedback,
      avgRating
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBanned: { $ne: true } }),
      User.countDocuments({ isBanned: true }),
      SwapRequest.countDocuments(),
      SwapRequest.countDocuments({ status: 'pending' }),
      SwapRequest.countDocuments({ status: 'accepted' }),
      Feedback.countDocuments(),
      Feedback.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ])
    ]);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      newUsersLast30Days,
      newSwapsLast30Days,
      newFeedbackLast30Days
    ] = await Promise.all([
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      SwapRequest.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Feedback.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
    ]);

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          active: totalActiveUsers,
          banned: totalBannedUsers,
          newLast30Days: newUsersLast30Days
        },
        swaps: {
          total: totalSwaps,
          pending: pendingSwaps,
          accepted: acceptedSwaps,
          newLast30Days: newSwapsLast30Days
        },
        feedback: {
          total: totalFeedback,
          averageRating: avgRating.length > 0 ? avgRating[0].avgRating : 0,
          newLast30Days: newFeedbackLast30Days
        }
      }
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

// @route   GET /api/admin/report
// @desc    Generate and download activity report as CSV
// @access  Private (Admin only)
router.get('/report', authenticate, requireAdmin, async (req, res) => {
  try {
    const { 
      type = 'users', // users, swaps, feedback
      format = 'csv',
      startDate,
      endDate
    } = req.query;

    let query = {};
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    let data = [];
    let filename = '';
    let headers = [];

    switch (type) {
      case 'users':
        const users = await User.find(query).select('-password').lean();
        headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Location', 'Skills Offered', 'Skills Wanted', 'Joined Date', 'Banned', 'Ban Reason'];
        data = users.map(user => [
          user._id,
          user.name,
          user.email,
          user.role,
          user.availability,
          user.location || '',
          user.skillsOffered.join('; '),
          user.skillsWanted.join('; '),
          user.createdAt.toISOString().split('T')[0],
          user.isBanned ? 'Yes' : 'No',
          user.banReason || ''
        ]);
        filename = `users_report_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'swaps':
        const swaps = await SwapRequest.find(query)
          .populate('requesterId', 'name email')
          .populate('receiverId', 'name email')
          .lean();
        headers = ['ID', 'Requester Name', 'Requester Email', 'Receiver Name', 'Receiver Email', 'Skill Offered', 'Skill Wanted', 'Status', 'Message', 'Created Date', 'Updated Date'];
        data = swaps.map(swap => [
          swap._id,
          swap.requesterId?.name || '',
          swap.requesterId?.email || '',
          swap.receiverId?.name || '',
          swap.receiverId?.email || '',
          swap.skillOffered,
          swap.skillWanted,
          swap.status,
          swap.message || '',
          swap.createdAt.toISOString().split('T')[0],
          swap.updatedAt.toISOString().split('T')[0]
        ]);
        filename = `swaps_report_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'feedback':
        const feedback = await Feedback.find(query)
          .populate('fromUserId', 'name email')
          .populate('toUserId', 'name email')
          .populate('swapId', 'skillOffered skillWanted')
          .lean();
        headers = ['ID', 'From User', 'From Email', 'To User', 'To Email', 'Rating', 'Comment', 'Skill Offered', 'Skill Wanted', 'Created Date'];
        data = feedback.map(fb => [
          fb._id,
          fb.fromUserId?.name || '',
          fb.fromUserId?.email || '',
          fb.toUserId?.name || '',
          fb.toUserId?.email || '',
          fb.rating,
          fb.comment,
          fb.swapId?.skillOffered || '',
          fb.swapId?.skillWanted || '',
          fb.createdAt.toISOString().split('T')[0]
        ]);
        filename = `feedback_report_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type. Use: users, swaps, or feedback'
        });
    }

    // Generate CSV
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.map(field => 
        typeof field === 'string' && field.includes(',') ? 
        `"${field.replace(/"/g, '""')}"` : field
      ).join(','))
    ].join('\n');

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csvContent);

  } catch (error) {
    console.error('Admin report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating report'
    });
  }
});

// @route   GET /api/admin/users/:id/activity
// @desc    Get detailed activity for a specific user
// @access  Private (Admin only)
router.get('/users/:id/activity', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const [swapRequests, feedback] = await Promise.all([
      SwapRequest.find({
        $or: [
          { requesterId: id },
          { receiverId: id }
        ]
      })
        .populate('requesterId', 'name email')
        .populate('receiverId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      
      Feedback.find({
        $or: [
          { fromUserId: id },
          { toUserId: id }
        ]
      })
        .populate('fromUserId', 'name email')
        .populate('toUserId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
    ]);

    res.json({
      success: true,
      user,
      activity: {
        swapRequests,
        feedback
      }
    });

  } catch (error) {
    console.error('Admin user activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user activity'
    });
  }
});

// @route   POST /api/admin/send-report
// @desc    Send platform report to all admins
// @access  Private (Admin only)
router.post('/send-report', authenticate, requireAdmin, async (req, res) => {
  try {
    const { period = 'Weekly' } = req.body;

    // Get platform statistics
    const [
      totalUsers,
      totalActiveUsers,
      totalBannedUsers,
      totalSwaps,
      pendingSwaps,
      acceptedSwaps,
      totalFeedback,
      avgRatingResult
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBanned: { $ne: true } }),
      User.countDocuments({ isBanned: true }),
      SwapRequest.countDocuments(),
      SwapRequest.countDocuments({ status: 'pending' }),
      SwapRequest.countDocuments({ status: 'accepted' }),
      Feedback.countDocuments(),
      Feedback.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
      ])
    ]);

    const stats = {
      totalUsers,
      totalActiveUsers,
      totalBannedUsers,
      totalSwaps,
      pendingSwaps,
      acceptedSwaps,
      totalFeedback,
      avgRating: avgRatingResult.length > 0 ? 
        Math.round(avgRatingResult[0].avgRating * 10) / 10 : 0
    };

    // Get all admin emails
    const admins = await User.find({ role: 'admin' }).select('email name');
    
    const emailPromises = admins.map(admin => 
      sendPlatformReportEmail(admin.email, admin.name, stats, period)
    );

    await Promise.all(emailPromises);

    res.json({
      success: true,
      message: `Platform report sent to ${admins.length} admin(s)`,
      recipients: admins.map(admin => admin.email),
      stats
    });

  } catch (error) {
    console.error('Send platform report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending platform report'
    });
  }
});

// @route   POST /api/admin/test-email
// @desc    Test email configuration
// @access  Private (Admin only)
router.post('/test-email', authenticate, requireAdmin, async (req, res) => {
  try {
    const { sendUserBannedEmail } = require('../utils/emailService');
    
    // Send test email to the requesting admin
    const result = await sendUserBannedEmail(
      req.user.email, 
      req.user.name, 
      'This is a test email to verify email configuration is working properly.'
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: result.error
      });
    }

  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending test email',
      error: error.message
    });
  }
});

module.exports = router;
