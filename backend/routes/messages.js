const express = require('express');
const { ChannelMember, Message } = require('../db/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/channel/:channelId', authenticateToken, async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // Verify user is a member of the channel
    const memberCheck = await ChannelMember.findOne({
      channelId: channelId,
      userId: req.user.id
    });

    if (!memberCheck) {
      return res.status(403).json({ error: 'You are not a member of this channel' });
    }

    // Get messages
    const totalMessages = await Message.countDocuments({ channelId });
    const messages = await Message.find({ channelId })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);

    const totalPages = Math.ceil(totalMessages / limit);

    res.json({
      messages: messages.reverse().map(msg => ({
        id: msg._id,
        content: msg.content,
        created_at: msg.createdAt,
        user_id: msg.userId._id,
        username: msg.userId.username,
        email: msg.userId.email
      })), // Reverse to show oldest first
      pagination: {
        page,
        limit,
        totalMessages,
        totalPages,
        hasMore: page < totalPages
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
