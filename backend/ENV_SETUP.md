# Environment Variables Setup

Please provide the following information to configure your database connection:

## Required Information

### Option 1: Local PostgreSQL Database

If you have PostgreSQL installed locally, provide:

1. **DB_HOST**: Usually `localhost` (already set)
2. **DB_PORT**: Usually `5432` (already set)
3. **DB_NAME**: Your database name (e.g., `chat_app`)
4. **DB_USER**: Your PostgreSQL username (e.g., `postgres`)
5. **DB_PASSWORD**: Your PostgreSQL password

### Option 2: Cloud Database (Recommended)

If you're using a cloud database service (Neon, Supabase, Railway), provide:

1. **DB_HOST**: Your database host (e.g., `ep-cool-darkness-123456.us-east-2.aws.neon.tech`)
2. **DB_PORT**: Usually `5432`
3. **DB_NAME**: Your database name
4. **DB_USER**: Your database username
5. **DB_PASSWORD**: Your database password
6. **DB_SSL**: Set to `true` for cloud databases

## Example Format

Please provide your details in this format:

```
DB_HOST=your-host-here
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-username
DB_PASSWORD=your-password
DB_SSL=true (if using cloud database, otherwise omit this line)
```

## Quick Setup Options

### If you don't have a database yet:

1. **Neon (Recommended - Free)**: 
   - Go to https://neon.tech
   - Sign up for free
   - Create a new project
   - Copy the connection string or individual credentials

2. **Supabase (Free)**:
   - Go to https://supabase.com
   - Sign up and create a project
   - Go to Settings > Database
   - Copy the connection details

3. **Railway (Free)**:
   - Go to https://railway.app
   - Sign up and create a PostgreSQL service
   - Copy the connection details

## After Providing Details

Once you provide the information, I'll update the `.env` file and start the application!

