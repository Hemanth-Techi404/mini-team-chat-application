# Mini Team Chat Application

A real-time team chat application similar to Slack, built with React, Node.js, Express, Socket.io, and PostgreSQL.

## Features

### Core Requirements ✅

- **User Authentication**: Sign up, login, and persistent sessions using JWT tokens
- **Channels**: Create, view, join, and leave channels
- **Real-Time Messaging**: Instant messaging using WebSockets (Socket.io)
- **Online Status**: Track and display which users are currently online
- **Message History**: Load message history with pagination support
- **Clean UI**: Modern, responsive interface built with React and Tailwind CSS

### Technical Stack

**Backend:**
- Node.js with Express
- Socket.io for real-time communication
- 
- JWT for authentication
- bcryptjs for password hashing

**Frontend:**
- React 18
- React Router for navigation
- Socket.io-client for WebSocket connection
- Axios for HTTP requests
- Tailwind CSS for styling

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database (local or cloud-hosted)
- npm or yarn

### Database Setup

1. **Option 1: Local PostgreSQL**
   - Install PostgreSQL on your machine
   - Create a database:
     ```sql
     CREATE DATABASE chat_app;
     ```

2. **Option 2: Cloud Database (Recommended for deployment)**
   - Sign up for a free PostgreSQL hosting service:
     - [Neon](https://neon.tech) - Free tier available
     - [Supabase](https://supabase.com) - Free tier available
     - [Railway](https://railway.app) - Free tier available
   - Get your database connection string

### Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies for all packages:**
   ```bash
   npm run install-all
   ```

   Or install separately:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure Backend Environment Variables**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=chat_app
   DB_USER=postgres
   DB_PASSWORD=your_password
   NODE_ENV=development
   ```

   For cloud databases, update the connection details:
   ```env
   DB_HOST=your-db-host.neon.tech
   DB_PORT=5432
   DB_NAME=your-db-name
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_SSL=true
   ```

4. **Start the Application**

   Run both backend and frontend concurrently:
   ```bash
   npm run dev
   ```

   Or run separately:
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm run client
   ```

5. **Access the Application**

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

1. **Register a new account** or **login** with existing credentials
2. **Create a channel** or **join existing channels**
3. **Select a channel** to view messages and chat
4. **Send messages** in real-time - they appear instantly for all users
5. **View online users** in the sidebar
6. **Load older messages** by scrolling to the top of the chat

## Project Structure

```
chat-app/
├── backend/
│   ├── db/
│   │   └── init.js          # Database initialization
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── channels.js      # Channel routes
│   │   └── messages.js      # Message routes
│   ├── socket/
│   │   └── socketHandler.js # Socket.io event handlers
│   ├── server.js            # Express server setup
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Register.js
│   │   │   └── Chat/
│   │   │       ├── Chat.js
│   │   │       ├── ChannelList.js
│   │   │       ├── ChannelView.js
│   │   │       └── OnlineUsers.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── SocketContext.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Channels
- `GET /api/channels` - Get all channels
- `GET /api/channels/my-channels` - Get user's channels
- `GET /api/channels/:id` - Get channel details
- `POST /api/channels` - Create new channel
- `POST /api/channels/:id/join` - Join channel
- `POST /api/channels/:id/leave` - Leave channel

### Messages
- `GET /api/messages/channel/:channelId?page=1&limit=50` - Get messages with pagination

## Deployment

### Backend Deployment

1. **Environment Variables**: Set all environment variables in your hosting platform
2. **Database**: Use a cloud PostgreSQL service (Neon, Supabase, Railway)
3. **Hosting Options**:
   - [Railway](https://railway.app)
   - [Render](https://render.com)
   - [Heroku](https://heroku.com)
   - [Vercel](https://vercel.com) (for serverless)

### Frontend Deployment

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Update API URL**: Set `REACT_APP_API_URL` and `REACT_APP_SOCKET_URL` in your hosting environment

3. **Hosting Options**:
   - [Vercel](https://vercel.com) - Recommended
   - [Netlify](https://netlify.com)
   - [GitHub Pages](https://pages.github.com)

### Example Deployment (Vercel + Railway)

1. **Backend (Railway)**:
   - Connect your GitHub repo
   - Add PostgreSQL service
   - Set environment variables
   - Deploy

2. **Frontend (Vercel)**:
   - Connect your GitHub repo
   - Set build command: `cd frontend && npm install && npm run build`
   - Set output directory: `frontend/build`
   - Add environment variables:
     - `REACT_APP_API_URL=https://your-backend.railway.app/api`
     - `REACT_APP_SOCKET_URL=https://your-backend.railway.app`
   - Deploy

## Database Schema

- **users**: User accounts (id, username, email, password_hash)
- **channels**: Chat channels (id, name, description, created_by)
- **channel_members**: Channel membership (channel_id, user_id)
- **messages**: Chat messages (id, channel_id, user_id, content, created_at)

## Security Notes

- Passwords are hashed using bcryptjs
- JWT tokens expire after 7 days
- All API routes (except auth) require authentication
- SQL injection protection via parameterized queries
- CORS configured for frontend origin

## Future Enhancements (Optional)

- Private/DM channels
- Typing indicators
- Message editing and deletion
- Message search functionality
- File attachments
- User profiles and avatars
- Emoji reactions
- Message threads

## License

ISC

## Support

For issues or questions, please check the code comments or create an issue in the repository.

