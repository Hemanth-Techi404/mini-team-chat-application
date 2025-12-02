# Render Deployment Guide

## ✅ Frontend Configuration

Your frontend code has been updated to support environment variables. Now you need to configure them in Render.

### 1. Go to Render Dashboard
1. Open your **Frontend Service** in Render.
2. Click on **Environment** in the sidebar.

### 2. Add Environment Variables
Add the following variables:

| Key | Value | Description |
|-----|-------|-------------|
| `REACT_APP_API_URL` | `https://your-backend-url.onrender.com/api` | URL of your deployed backend + `/api` |
| `REACT_APP_SOCKET_URL` | `https://your-backend-url.onrender.com` | URL of your deployed backend (no `/api`) |

> [!IMPORTANT]
> Make sure to replace `https://your-backend-url.onrender.com` with your **actual backend URL** from Render.

### 3. Redeploy
1. Click **Save Changes**.
2. Go to **Events** or **Deploys**.
3. Click **Manual Deploy** -> **Deploy latest commit** (if it doesn't auto-deploy).

## 🔍 Troubleshooting

If you still see 404 errors:
1.  **Check the URL**: Open the browser console (F12) -> Network tab. Look at the failed requests. Are they going to `localhost` or your Render URL?
2.  **Verify Backend**: Visit `https://your-backend-url.onrender.com/api/health` in your browser. It should say `{"status":"ok"}`.
3.  **CORS**: Ensure your backend allows requests from your frontend URL (you might need to update `CLIENT_URL` in your backend environment variables too).
