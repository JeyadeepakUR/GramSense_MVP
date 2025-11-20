# Vercel Deployment Configuration

## Root Directory
Set to: `/` (root)

## Framework Preset
Select: **Vite**

## Build Settings

### Build Command
```bash
npm run build
```

### Output Directory
```
dist
```

### Install Command
```bash
npm install
```

## Environment Variables (if backend deployed separately)

If you deploy the backend separately (e.g., on Railway, Render, or Vercel Serverless):

```
VITE_BACKEND_URL=https://your-backend-url.com
```

## Deployment Steps

### 1. Push to GitHub (Already done ✅)

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import `JeyadeepakUR/GramSense_MVP`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install` (auto-detected)

### 3. Deploy

Click **"Deploy"** - Vercel will automatically build and deploy!

## Expected Build Output

```
✓ building client + server bundles...
✓ rendering pages...
✓ 42 modules transformed.
dist/index.html                   X.XX kB
dist/assets/index-XXXXX.js        XXX kB
dist/assets/index-XXXXX.css       XX kB
```

## Post-Deployment

### Test Features:
- ✅ Voice recording (requires HTTPS - Vercel provides this)
- ✅ Offline mode (Service Worker)
- ✅ Geo-location (browser permission)
- ✅ IndexedDB storage
- ⚠️ Backend sync (needs backend deployed separately)

## Backend Deployment (Optional)

For full functionality, deploy backend separately:

**Option 1: Vercel Serverless Functions**
- Move `backend/` to `api/` folder
- Convert FastAPI to Vercel serverless

**Option 2: Railway/Render**
- Deploy FastAPI backend as standalone service
- Add VITE_BACKEND_URL env variable in Vercel

**Option 3: Demo Mode**
- App works fully offline without backend
- Sync functionality disabled

## Troubleshooting

### Build fails with "Cannot find module"
- Ensure all dependencies in package.json
- Check import paths use `@core` alias correctly

### Speech Recognition not working
- Vercel automatically provides HTTPS
- Web Speech API requires secure context

### Service Worker issues
- Check browser console for registration errors
- Clear cache and reload

## Performance Optimization (Already Configured)

- ✅ Code splitting with manual chunks
- ✅ Asset caching headers
- ✅ Clean URLs enabled
- ✅ SPA routing configured
