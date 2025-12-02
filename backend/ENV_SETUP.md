# Environment Variables Setup

The application uses MongoDB as the database. Configure the MONGO_URL environment variable for your connection.

## Required Information

### MONGO_URL
- **Local MongoDB**: `mongodb://localhost:27017/chat_app`
- **Cloud MongoDB (Recommended)**: Use a connection string from MongoDB Atlas or similar.

Example for MongoDB Atlas:
```
MONGO_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/chat_app?retryWrites=true&w=majority
```

## Quick Setup Options

### If you don't have a database yet:

1. **MongoDB Atlas (Recommended - Free Tier)**:
   - Go to https://www.mongodb.com/atlas
   - Sign up for free
   - Create a new cluster
   - Add your IP address to the allowlist (0.0.0.0/0 for testing, but restrict in production)
   - Create a database user
   - Get the connection string and replace `<username>`, `<password>`, and database name

## Deployment Notes
- On platforms like Render.com, set MONGO_URL in the environment variables section of your service dashboard.
- Never commit the .env file or hardcode credentials in code/logs.
- Ensure the connection string does not expose credentials in error logs.

## After Setup
Update your .env file with:
```
MONGO_URL=your-connection-string-here
```

For production, use the platform's env var settings instead of .env.
