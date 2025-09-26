const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Mock notifications - in real app, these would come from database
    const notifications = [
      {
        id: '1',
        type: 'booking',
        title: 'Booking Confirmed',
        message: 'Your booking BK123456789 has been confirmed for Route 15',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: false,
        priority: 'medium'
      },
      {
        id: '2',
        type: 'route',
        title: 'Route Update',
        message: 'Route 22 is experiencing delays due to traffic',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        isRead: true,
        priority: 'high'
      },
      {
        id: '3',
        type: 'promotion',
        title: 'Special Offer',
        message: 'Get 20% off on your next booking with code SAVE20',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        isRead: false,
        priority: 'low'
      }
    ];

    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.post('/:id/read', auth, async (req, res) => {
  try {
    // In real app, update notification status in database
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.post('/read-all', auth, async (req, res) => {
  try {
    // In real app, update all notifications for user
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
