const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User } = require('../db/init');

const router = express.Router();

// Middleware to check database connection
const checkDatabase = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.error('[AUTH] Database not connected! State:', mongoose.connection.readyState);
    return res.status(503).json({ 
      error: 'Database connection unavailable. Please try again later.' 
    });
  }
  next();
};

// Test endpoint to verify route is working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth routes are working!',
    timestamp: new Date().toISOString(),
    userModel: User ? 'User model loaded' : 'User model NOT loaded'
  });
});

// Register
router.post('/register', checkDatabase, async (req, res) => {
  try {
    console.log('[REGISTER] Request received:', {
      body: { ...req.body, password: '***hidden***' },
      headers: req.headers['content-type']
    });

    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      console.log('[REGISTER] Missing fields');
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid input format' });
    }

    // Trim and validate
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (trimmedUsername.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (trimmedPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    console.log(`[REGISTER] Attempting registration for: ${trimmedUsername}, ${trimmedEmail}`);

    // Escape special regex characters in username and email
    const escapeRegex = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    // Check if user exists (case-insensitive)
    const existingUser = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${escapeRegex(trimmedUsername)}$`, 'i') } },
        { email: { $regex: new RegExp(`^${escapeRegex(trimmedEmail)}$`, 'i') } }
      ]
    });

    if (existingUser) {
      console.log(`[REGISTER] User already exists: ${existingUser.username || existingUser.email}`);
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(trimmedPassword, 10);

    // Create user
    const user = new User({ 
      username: trimmedUsername, 
      email: trimmedEmail, 
      passwordHash 
    });
    await user.save();

    console.log(`[REGISTER] User created successfully: ${user.username}`);

    // Generate token
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('[REGISTER] Error:', error);
    console.error('[REGISTER] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login
router.post('/login', checkDatabase, async (req, res) => {
  try {
    console.log('[LOGIN] Request received:', {
      body: { username: req.body.username, password: '***hidden***' },
      headers: req.headers['content-type']
    });

    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      console.log('[LOGIN] Missing fields');
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Invalid input format' });
    }

    // Trim whitespace
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      return res.status(400).json({ error: 'Username and password cannot be empty' });
    }

    console.log(`[LOGIN] Attempting login for: ${trimmedUsername}`);

    // Escape special regex characters
    const escapeRegex = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    // Find user by username or email (case-insensitive)
    const user = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${escapeRegex(trimmedUsername)}$`, 'i') } },
        { email: { $regex: new RegExp(`^${escapeRegex(trimmedUsername)}$`, 'i') } }
      ]
    }).select('passwordHash username email _id');

    if (!user) {
      console.log(`[LOGIN] User not found: ${trimmedUsername}`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    console.log(`[LOGIN] User found: ${user.username}, verifying password...`);

    // Verify password
    if (!user.passwordHash) {
      console.error(`[LOGIN] User ${user.username} has no password hash!`);
      return res.status(500).json({ error: 'Account error. Please contact support.' });
    }

    const isValid = await bcrypt.compare(trimmedPassword, user.passwordHash);

    if (!isValid) {
      console.log(`[LOGIN] Invalid password for user: ${user.username}`);
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    console.log(`[LOGIN] Password verified successfully for: ${user.username}`);

    // Generate token
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log(`[LOGIN] Login successful for: ${user.username}`);

    res.json({
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('[LOGIN] Error:', error);
    console.error('[LOGIN] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Verify token
router.get('/verify', checkDatabase, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;

