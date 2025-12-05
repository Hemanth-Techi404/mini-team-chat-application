# Render Deployment Guide

## ✅ Frontend Configuration

Your frontend code has been updated to support environment variables and SPA routing. The `render.yaml` file has been configured with your backend URL.

### Backend URL
**Your Backend:** `https://mini-team-chat-application-8.onrender.com`

### 1. Automatic Deployment (Recommended)

If you're using `render.yaml`, Render should automatically:
- Create the frontend static site service
- Set environment variables from `render.yaml`
- Configure SPA routing

**Just push to GitHub and Render will deploy automatically!**

### 2. Manual Configuration (If Needed)

If the service doesn't auto-create from `render.yaml`:

#### A. Create Static Site Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Static Site**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `mini-team-chat-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`

#### B. Set Environment Variables
1. Go to **Environment** tab
2. Add these variables:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://mini-team-chat-application-8.onrender.com/api` |
| `REACT_APP_SOCKET_URL` | `https://mini-team-chat-application-8.onrender.com` |

#### C. Configure SPA Routing
1. Go to **Settings** tab
2. Scroll to **Redirects/Rewrites**
3. Add rewrite rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Type**: `Rewrite`

### 3. Update Backend CORS

After frontend deploys:
1. Go to **Backend Service** → **Environment**
2. Set `CLIENT_URL` to your frontend URL (e.g., `https://mini-team-chat-frontend.onrender.com`)

### 4. Verify Deployment

1. **Backend Health:**
   ```
   https://mini-team-chat-application-8.onrender.com/api/health
   ```
   Should return: `{"status":"ok"}`

2. **Frontend:**
   - Visit your frontend URL
   - Open DevTools (F12) → Console
   - Check for: `App Configuration: { API_URL: ..., SOCKET_URL: ... }`
   - Verify URLs point to Render backend (not localhost)

3. **Test Routes:**
   - Try `/login` and `/register` routes
   - They should load without 404 errors

## 🔍 Troubleshooting

### Still Getting 404 Errors?

1. **Check Network Tab:**
   - Open DevTools → Network tab
   - Look for failed requests
   - Verify they're going to Render URLs, not localhost

2. **Verify Environment Variables:**
   - Frontend service → Environment tab
   - Ensure variables are set correctly
   - **Important:** Must use `https://` (not `http://`)

3. **Check Routing:**
   - Settings → Redirects/Rewrites
   - Ensure rewrite rule is active: `/*` → `/index.html`

4. **Check Build Logs:**
   - Frontend service → Logs tab
   - Ensure build completed successfully

### CORS Errors?

1. Backend `CLIENT_URL` must match frontend URL exactly
2. Both URLs must use `https://`
3. Restart backend after changing `CLIENT_URL`

### Socket.io Issues?

1. Verify `REACT_APP_SOCKET_URL` points to backend (without `/api`)
2. Check backend Socket.io CORS in `backend/server.js`
3. Ensure `CLIENT_URL` matches frontend URL
