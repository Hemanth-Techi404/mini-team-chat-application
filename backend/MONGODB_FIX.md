# MongoDB Connection Fix Guide

## Problem
You're getting a `ENOTFOUND` DNS error when trying to connect to MongoDB Atlas. This means the server cannot resolve the MongoDB cluster hostname.

## Common Causes & Solutions

### 1. ✅ Check Your Connection String Format

Your `MONGO_URL` in the `.env` file should use **`mongodb+srv://`** (with the `+srv`) for MongoDB Atlas:

**❌ WRONG:**
```
MONGO_URL=mongodb://cluster0.5bdotf1.mongodb.net/chat_app
```

**✅ CORRECT:**
```
MONGO_URL=mongodb+srv://username:password@cluster0.5bdotf1.mongodb.net/chat_app?retryWrites=true&w=majority
```

### 2. 🔑 Get Your Correct Connection String from MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in to your account
3. Click on **"Connect"** for your cluster
4. Choose **"Connect your application"**
5. Select **Driver: Node.js** and **Version: 5.5 or later**
6. Copy the connection string
7. Replace `<password>` with your actual database user password
8. Replace `<dbname>` with your database name (e.g., `chat_app`)

### 3. 🌐 Verify Network Access

1. In MongoDB Atlas, go to **Network Access** (left sidebar)
2. Make sure your IP address is whitelisted
3. For development, you can add `0.0.0.0/0` (allows all IPs) - **NOT recommended for production**

### 4. 🔐 Verify Database User

1. In MongoDB Atlas, go to **Database Access** (left sidebar)
2. Make sure you have a database user created
3. Note the username and password
4. Ensure the user has read/write permissions

## Example .env File

```env
# MongoDB Atlas Connection (RECOMMENDED for production)
MONGO_URL=mongodb+srv://myusername:mypassword@cluster0.5bdotf1.mongodb.net/chat_app?retryWrites=true&w=majority

# OR Local MongoDB (for development only)
# MONGO_URL=mongodb://localhost:27017/chat_app

# Other environment variables
PORT=5000
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here
```

## Testing Your Connection

After updating your `.env` file:

1. **Stop the current server** (Ctrl+C in the terminal)
2. **Restart the server:**
   ```bash
   node server.js
   ```
3. **Check the console output** - you should see:
   ```
   ✅ MongoDB connected successfully
   Database: chat_app
   Host: cluster0-shard-00-00.5bdotf1.mongodb.net
   Server running on port 5000
   ```

## Alternative: Use Standard Connection String

If the SRV connection doesn't work, try the standard format:

```env
MONGO_URL=mongodb://cluster0-shard-00-00.5bdotf1.mongodb.net:27017,cluster0-shard-00-01.5bdotf1.mongodb.net:27017,cluster0-shard-00-02.5bdotf1.mongodb.net:27017/chat_app?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority
```

(You can get this from MongoDB Atlas under "Connect" → "Connect your application" → "Standard connection string")

## Still Having Issues?

1. **Check your internet connection** - Make sure you can access the internet
2. **Firewall/VPN** - Some corporate networks or VPNs block MongoDB Atlas connections
3. **Cluster Status** - Verify your MongoDB Atlas cluster is running (not paused)
4. **DNS Issues** - Try flushing your DNS cache:
   ```bash
   ipconfig /flushdns
   ```

## For Local Development (No Internet Required)

If you want to develop without internet, install MongoDB locally:

1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Update your `.env`:
   ```env
   MONGO_URL=mongodb://localhost:27017/chat_app
   ```
