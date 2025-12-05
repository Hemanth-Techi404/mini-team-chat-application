const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const channelRoutes = require('./routes/channels');
const messageRoutes = require('./routes/messages');
const { connectDB } = require('./db/init');
const { setupSocketIO } = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// CORS configuration - allow multiple origins in development
// Support multiple CLIENT_URLs separated by comma for deployment
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',').map(url => url.trim())
  : ["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all localhost origins
    if (process.env.NODE_ENV !== 'production') {
      if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

// Initialize Socket.io with CORS configuration
const io = socketIo(server, {
  cors: {
    origin: corsOptions.origin,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Root route for basic server verification
app.get('/', (req, res) => {
  res.send('Chat App Backend is running!');
});

// MongoDB connection health check endpoint
app.get('/api/db-health', (req, res) => {
  const mongoose = require('mongoose');
  const dbState = mongoose.connection.readyState;

  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  const isConnected = dbState === 1;

  res.json({
    status: isConnected ? 'ok' : 'error',
    database: {
      connected: isConnected,
      state: states[dbState],
      host: mongoose.connection.host || 'N/A',
      name: mongoose.connection.name || 'N/A',
      mongoUrl: process.env.MONGO_URL ? '***configured***' : 'not configured'
    }
  });
});

setupSocketIO(io);

connectDB()
  .then(() => {
    const startServer = (port, isRetry = false) => {
      // Listen on 0.0.0.0 to accept connections from any interface
      server.listen(port, '0.0.0.0', () => {
        console.log(`✅ Server running on port ${port}`);
        console.log(`🌐 Server accessible at http://localhost:${port}`);
        console.log(`📡 API available at http://localhost:${port}/api`);
        if (process.env.CLIENT_URL) {
          console.log(`🔒 CORS enabled for: ${process.env.CLIENT_URL}`);
        } else {
          console.log(`🔓 CORS enabled for localhost (development mode)`);
        }
      }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          if (!isRetry) {
            console.error(`Port ${port} is already in use.`);
            console.log('Trying alternative port...');
            const altPort = parseInt(port) + 1;
            startServer(altPort, true);
          } else {
            console.error(`Port ${port} is also in use. Please stop other servers or change the PORT in .env`);
            process.exit(1);
          }
        } else {
          console.error('Server error:', err);
          process.exit(1);
        }
      });
    };

    startServer(PORT);
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

