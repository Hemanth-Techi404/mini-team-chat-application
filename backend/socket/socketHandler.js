const jwt = require('jsonwebtoken');
const { Message, ChannelMember } = require('../db/init');

// Store online users: userId -> { username, socketIds: Set }
const onlineUsers = new Map();

const setupSocketIO = (io) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Verify user exists
      const { User } = require('../db/init');
      const user = await User.findById(decoded.userId);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = decoded.userId;
      socket.username = decoded.username;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    const username = socket.username;

    console.log(`User connected: ${username} (${userId})`);

    // Add user to online users
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, { username, socketIds: new Set() });
    }
    onlineUsers.get(userId).socketIds.add(socket.id);

    // Emit online status to all clients
    io.emit('user-online', { userId, username });
    
    // Send current online users to the newly connected user
    const currentOnlineUsers = Array.from(onlineUsers.entries()).map(([uid, data]) => ({
      userId: uid,
      username: data.username
    }));
    socket.emit('online-users', currentOnlineUsers);

    // Join channel rooms
    socket.on('join-channel', async (channelId) => {
      socket.join(`channel-${channelId}`);
      console.log(`${username} joined channel ${channelId}`);

      // Verify user is a member
      const memberCheck = await ChannelMember.findOne({
        channelId: channelId,
        userId: userId
      });

      if (memberCheck) {
        socket.to(`channel-${channelId}`).emit('user-joined-channel', {
          userId,
          username,
          channelId
        });
      }
    });

    socket.on('leave-channel', (channelId) => {
      socket.leave(`channel-${channelId}`);
      console.log(`${username} left channel ${channelId}`);
    });

    // Handle new message
    socket.on('send-message', async (data) => {
      try {
        const { channelId, content } = data;

        if (!content || content.trim().length === 0) {
          return socket.emit('error', { message: 'Message content is required' });
        }

        // Verify user is a member of the channel
        const memberCheck = await ChannelMember.findOne({
          channelId: channelId,
          userId: userId
        });

        if (!memberCheck) {
          return socket.emit('error', { message: 'You are not a member of this channel' });
        }

        // Save message to database
        const message = new Message({
          channelId: channelId,
          userId: userId,
          content: content.trim()
        });
        await message.save();

        // Get user info
        const { User } = require('../db/init');
        const user = await User.findById(userId);

        const messageData = {
          id: message._id,
          content: message.content,
          created_at: message.createdAt,
          user_id: user._id,
          username: user.username,
          email: user.email
        };

        // Emit to all users in the channel
        io.to(`channel-${channelId}`).emit('new-message', messageData);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Get online users
    socket.on('get-online-users', () => {
      const onlineUserList = Array.from(onlineUsers.entries()).map(([userId, data]) => ({
        userId,
        username: data.username
      }));
      socket.emit('online-users', onlineUserList);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${username} (${userId})`);

      // Remove socket from user's socket set
      if (onlineUsers.has(userId)) {
        onlineUsers.get(userId).socketIds.delete(socket.id);
        
        // If user has no more sockets, remove from online users
        if (onlineUsers.get(userId).socketIds.size === 0) {
          onlineUsers.delete(userId);
          // Emit offline status
          io.emit('user-offline', { userId, username });
        }
      }
    });
  });

  // Helper function to get online users
  const getOnlineUsers = () => {
    return Array.from(onlineUsers.keys());
  };

  return { getOnlineUsers };
};

module.exports = { setupSocketIO };

