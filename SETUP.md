# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm run install-all
```

Or manually:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Step 2: Set Up Database

### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a database:
   ```sql
   CREATE DATABASE chat_app;
   ```
3. Update `backend/.env` with your local database credentials

### Option B: Cloud Database (Recommended)

1. Sign up for a free PostgreSQL service:
   - [Neon](https://neon.tech) - Recommended, free tier available
   - [Supabase](https://supabase.com) - Free tier available
   - [Railway](https://railway.app) - Free tier available

2. Get your connection string or individual credentials

## Step 3: Configure Environment Variables

### Backend Configuration

Create `backend/.env` file:

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

For cloud databases, use:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_HOST=your-db-host.neon.tech
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_SSL=true
NODE_ENV=development
```

### Frontend Configuration (Optional)

Create `frontend/.env` file if you need to change API URLs:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Step 4: Start the Application

### Development Mode (Both servers)

```bash
npm run dev
```

### Or Run Separately

Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run client
```

## Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## First Time Usage

1. Open http://localhost:3000
2. Click "Register here" to create an account
3. After registration, you'll be automatically logged in
4. Create your first channel or join existing ones
5. Start chatting!

## Troubleshooting

### Database Connection Issues

- Verify your database credentials in `backend/.env`
- Ensure PostgreSQL is running (if using local)
- Check firewall settings for cloud databases
- Verify SSL settings if using cloud database

### Port Already in Use

- Change `PORT` in `backend/.env` if 5000 is taken
- React default port is 3000, change in `frontend/package.json` if needed

### Module Not Found Errors

- Run `npm install` in both `backend` and `frontend` directories
- Delete `node_modules` and reinstall if issues persist

### Socket Connection Issues

- Ensure backend is running before frontend
- Check CORS settings in `backend/server.js`
- Verify `REACT_APP_SOCKET_URL` matches backend URL

## Next Steps

- See `README.md` for deployment instructions
- Customize the UI in `frontend/src/components`
- Add features like private channels, typing indicators, etc.

