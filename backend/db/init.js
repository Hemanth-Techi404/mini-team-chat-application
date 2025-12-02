const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/chat_app';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed. Check your MONGO_URL environment variable.');
    throw error;
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Channel Schema
const channelSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

// Channel Member Schema
const channelMemberSchema = new mongoose.Schema({
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  joinedAt: { type: Date, default: Date.now }
});
channelMemberSchema.index({ channelId: 1, userId: 1 }, { unique: true });

// Message Schema
const messageSchema = new mongoose.Schema({
  channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
messageSchema.index({ channelId: 1, createdAt: -1 });

const User = mongoose.model('User', userSchema);
const Channel = mongoose.model('Channel', channelSchema);
const ChannelMember = mongoose.model('ChannelMember', channelMemberSchema);
const Message = mongoose.model('Message', messageSchema);

module.exports = { connectDB, User, Channel, ChannelMember, Message };

