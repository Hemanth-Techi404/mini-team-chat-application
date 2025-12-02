const express = require('express');
const { Channel, ChannelMember, Message } = require('../db/init');
const { authenticateToken } = require('../middleware/auth');
 
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const channels = await Channel.find({})
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });

    const channelsWithCounts = await Promise.all(channels.map(async (channel) => {
      const memberCount = await ChannelMember.countDocuments({ channelId: channel._id });
      const messageCount = await Message.countDocuments({ channelId: channel._id });

      return {
        id: channel._id,
        name: channel.name,
        description: channel.description,
        created_at: channel.createdAt,
        member_count: memberCount,
        message_count: messageCount
      };
    }));

    res.json(channelsWithCounts);
  } catch (error) {
    console.error('Get channels error:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

router.get('/my-channels', authenticateToken, async (req, res) => {
  try {
    const memberships = await ChannelMember.find({ userId: req.user.id }).populate('channelId');
    const channels = memberships.map(m => m.channelId);

    const channelsWithCounts = await Promise.all(channels.map(async (channel) => {
      const memberCount = await ChannelMember.countDocuments({ channelId: channel._id });
      const messageCount = await Message.countDocuments({ channelId: channel._id });

      return {
        id: channel._id,
        name: channel.name,
        description: channel.description,
        created_at: channel.createdAt,
        member_count: memberCount,
        message_count: messageCount
      };
    }));

    res.json(channelsWithCounts);
  } catch (error) {
    console.error('Get my channels error:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const memberCount = await ChannelMember.countDocuments({ channelId: channel._id });
    const members = await ChannelMember.find({ channelId: channel._id })
      .populate('userId', 'id username email')
      .sort({ joinedAt: 1 });

    res.json({
      id: channel._id,
      name: channel.name,
      description: channel.description,
      created_at: channel.createdAt,
      member_count: memberCount,
      members: members.map(m => ({
        id: m.userId._id,
        username: m.userId.username,
        email: m.userId.email
      }))
    });
  } catch (error) {
    console.error('Get channel error:', error);
    res.status(500).json({ error: 'Failed to fetch channel' });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Channel name is required' });
    }

    const existing = await Channel.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ error: 'Channel name already exists' });
    }

    const channel = new Channel({
      name: name.trim(),
      description: description || null,
      createdBy: req.user.id
    });
    await channel.save();

    const membership = new ChannelMember({
      channelId: channel._id,
      userId: req.user.id
    });
    await membership.save();

    res.status(201).json({
      id: channel._id,
      name: channel.name,
      description: channel.description,
      created_at: channel.createdAt
    });
  } catch (error) {
    console.error('Create channel error:', error);
    res.status(500).json({ error: 'Failed to create channel' });
  }
});

router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const existing = await ChannelMember.findOne({
      channelId: channel._id,
      userId: req.user.id
    });

    if (existing) {
      return res.status(400).json({ error: 'Already a member of this channel' });
    }

    const membership = new ChannelMember({
      channelId: channel._id,
      userId: req.user.id
    });
    await membership.save();

    res.json({ message: 'Joined channel successfully' });
  } catch (error) {
    console.error('Join channel error:', error);
    res.status(500).json({ error: 'Failed to join channel' });
  }
});

router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const result = await ChannelMember.deleteOne({ channelId: channel._id, userId: req.user.id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Not a member of this channel' });
    }

    res.json({ message: 'Left channel successfully' });
  } catch (error) {
    console.error('Leave channel error:', error);
    res.status(500).json({ error: 'Failed to leave channel' });
  }
});

module.exports = router;

