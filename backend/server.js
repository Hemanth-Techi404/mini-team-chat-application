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
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

setupSocketIO(io);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
        console.log('Trying alternative port...');
        const altPort = parseInt(PORT) + 1;
        server.listen(altPort, () => {
          console.log(`Server running on alternative port ${altPort}`);
        });
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });

