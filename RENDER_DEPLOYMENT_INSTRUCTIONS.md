# 🚀 Render Deployment Instructions

## 📋 Build Commands & Start Commands for Render

### 🔧 Backend Service (Web Service)

**Service Type:** Web Service  
**Environment:** Node

#### Build Command:
```bash
cd backend && npm install
```

#### Start Command:
```bash
cd backend && npm start
```

**Alternative Start Command (if above doesn't work):**
```bash
node backend/server.js
```

---

### 🎨 Frontend Service (Static Site)

**Service Type:** Static Site

#### Build Command:
```bash
npm install --prefix frontend && npm run build --prefix frontend
```

**Alternative (if above doesn't work):**
```bash
cd frontend && npm install && npm run build
```
*Note: If using `cd frontend`, set Publish Directory to `build` (not `frontend/build`)*

#### Publish Directory:
```
frontend/build
```

---

## 📝 Step-by-Step Deployment Guide

### Step 1: Deploy Backend Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

   **Name:** `mini-team-chat-backend`
   
   **Environment:** `Node`
   
   **Region:** Choose closest to you
   
   **Branch:** `main` (or your default branch)
   
   **Root Directory:** Leave empty (or `backend` if you want)
   
   **Build Command:**
   ```
   cd backend && npm install
   ```
   
   **Start Command:**
   ```
   cd backend && npm start
   ```
   
   **OR:**
   ```
   node backend/server.js
   ```

5. **Environment Variables:**
   - `NODE_ENV` = `production`
   - `PORT` = Leave empty (Render auto-assigns)
   - `MONGO_URL` = Your MongoDB connection string
   - `JWT_SECRET` = A strong random secret (e.g., generate with: `openssl rand -base64 32`)
   - `CLIENT_URL` = Your frontend URL (set after frontend deploys)

6. Click **Create Web Service**

---

### Step 2: Deploy Frontend Service

1. In Render Dashboard, click **New +** → **Static Site**
2. Connect your GitHub repository
3. Configure the service:

   **Name:** `mini-team-chat-frontend`
   
   **Branch:** `main` (or your default branch)
   
   **Root Directory:** Leave empty
   
   **Build Command:**
   ```
   npm install --prefix frontend && npm run build --prefix frontend
   ```
   
   **Alternative:**
   ```
   cd frontend && npm install && npm run build
   ```
   *If using the alternative, set Publish Directory to `build` instead of `frontend/build`*
   
   **Publish Directory:**
   ```
   frontend/build
   ```

4. **Environment Variables:**
   - `REACT_APP_API_URL` = `https://your-backend-url.onrender.com/api`
     - Replace `your-backend-url` with your actual backend service URL
   - `REACT_APP_SOCKET_URL` = `https://your-backend-url.onrender.com`
     - Same URL but without `/api`

5. Click **Create Static Site**

---

## 🔄 Using render.yaml (Automatic Deployment)

If you have `render.yaml` in your repository root, Render will auto-detect and create services.

### Current render.yaml Configuration:

```yaml
services:
  - type: web
    name: mini-team-chat-backend
    env: node
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGO_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: CLIENT_URL
        sync: false
  - type: static
    name: mini-team-chat-frontend
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/build
    envVars:
      - key: REACT_APP_API_URL
        value: https://mini-team-chat-application-8.onrender.com/api
      - key: REACT_APP_SOCKET_URL
        value: https://mini-team-chat-application-8.onrender.com
```

**To use render.yaml:**
1. Push `render.yaml` to your repository
2. Render will automatically detect it
3. Services will be created automatically
4. You'll still need to set environment variables in the dashboard

---

## ⚙️ Environment Variables Setup

### Backend Environment Variables:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | (auto) | Port (auto-assigned by Render) |
| `MONGO_URL` | `mongodb+srv://...` | MongoDB connection string |
| `JWT_SECRET` | `your-secret-key` | JWT signing secret |
| `CLIENT_URL` | `https://your-frontend.onrender.com` | Frontend URL for CORS |

### Frontend Environment Variables:

| Key | Value | Description |
|-----|-------|-------------|
| `REACT_APP_API_URL` | `https://your-backend.onrender.com/api` | Backend API URL |
| `REACT_APP_SOCKET_URL` | `https://your-backend.onrender.com` | Backend Socket.io URL |

---

## 🔧 Manual Configuration (If render.yaml doesn't work)

### Backend Service Settings:

**Build Command:**
```bash
cd backend && npm install
```

**Start Command:**
```bash
cd backend && npm start
```

**OR:**
```bash
node backend/server.js
```

### Frontend Service Settings:

**Build Command:**
```bash
cd frontend && npm install && npm run build
```

**Publish Directory:**
```
frontend/build
```

---

## 📍 Important Notes

1. **Root Directory:** Leave empty for both services (Render will detect the structure)

2. **Build Timeout:** Render has a 45-minute build timeout. If your build takes longer, optimize dependencies.

3. **Node Version:** Render uses Node.js 18.x by default. If you need a specific version, add `.nvmrc` file:
   ```
   18.17.0
   ```

4. **SPA Routing:** After frontend deploys, configure rewrite rule:
   - Go to Frontend Service → Settings → Redirects/Rewrites
   - Add: Source: `/*`, Destination: `/index.html`, Action: `Rewrite`

5. **CORS:** After frontend deploys, update backend `CLIENT_URL` environment variable with your frontend URL.

---

## ✅ Verification Checklist

After deployment:

- [ ] Backend service is running (check logs)
- [ ] Frontend service is built successfully
- [ ] Environment variables are set correctly
- [ ] Backend health check: `https://your-backend.onrender.com/api/health`
- [ ] Frontend loads without errors
- [ ] CORS is configured correctly
- [ ] SPA routing works (try `/login` route)

---

## 🐛 Troubleshooting

### Build Fails:
- Check build logs in Render dashboard
- Verify Node.js version compatibility
- Ensure all dependencies are in `package.json`

### Start Command Fails:
- Check start command syntax
- Verify `package.json` has `start` script
- Check server logs for errors

### Frontend 404 Errors:
- Configure SPA rewrite rule
- Verify `_redirects` file exists in `frontend/public/`
- Check build output directory

### CORS Errors:
- Verify `CLIENT_URL` matches frontend URL exactly
- Ensure both URLs use `https://`
- Restart backend after changing `CLIENT_URL`

---

## 📞 Quick Reference

**Backend Build:** `cd backend && npm install`  
**Backend Start:** `cd backend && npm start`  
**Frontend Build:** `npm install --prefix frontend && npm run build --prefix frontend`  
**Frontend Publish:** `frontend/build`

---

**Ready to deploy? Follow the steps above! 🚀**

