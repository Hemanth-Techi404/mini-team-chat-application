const mongoose = require('mongoose');
require('dotenv').config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/chat_app';

const connectDB = async () => {
  try {
    // Validate MongoDB URL format
    if (!mongoUrl) {
      throw new Error('MONGO_URL is not defined in environment variables');
    }

    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string format:', mongoUrl.includes('mongodb+srv') ? 'SRV (Atlas)' : 'Standard');

    // Connection options for better reliability
    const options = {
      serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoUrl, options);
    console.log('✅ MongoDB connected successfully');
    console.log('Database:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
  } catch (error) {
    console.error('❌ MongoDB connection failed');
    console.error('Error type:', error.name);
    console.error('Error code:', error.code);

    if (error.code === 'ENOTFOUND') {
      console.error('\n🔍 DNS Resolution Error - Possible causes:');
      console.error('1. Check if your MONGO_URL uses "mongodb+srv://" (not just "mongodb://")');
      console.error('2. Verify your internet connection');
      console.error('3. Check if the MongoDB cluster hostname is correct');
      console.error('4. Ensure your MongoDB Atlas cluster is running');
      console.error('5. Try using a standard connection string instead of SRV');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\n🔍 Connection Refused - Possible causes:');
      console.error('1. MongoDB server is not running');
      console.error('2. Firewall blocking the connection');
      console.error('3. Wrong port number');
    } else if (error.name === 'MongoServerError') {
      console.error('\n🔍 Authentication Error - Check your username and password');
    }

    console.error('\n📝 Your MONGO_URL should look like:');
    console.error('   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>');
    console.error('   OR');
    console.error('   mongodb://localhost:27017/<dbname> (for local development)');

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

