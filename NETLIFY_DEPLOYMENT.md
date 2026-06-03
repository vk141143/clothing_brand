# 🚀 Netlify Deployment Guide - CraftMySarees

## Prerequisites
- GitHub account with your repository
- Netlify account (https://netlify.com)
- Node.js 20+ installed locally

## Step 1: Prepare Your Repository

### 1.1 Ensure All Files Are Committed
```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

### 1.2 Verify Build Configuration
- ✅ `netlify.toml` - Already created
- ✅ `.netlifyignore` - Already created
- ✅ `package.json` - Has build script

## Step 2: Deploy to Netlify

### Option A: Connect GitHub to Netlify (Recommended)

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 20
6. Click "Deploy site"

### Option B: Manual Deployment (Netlify CLI)

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build locally:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod --dir=dist
```

## Step 3: Configure Environment Variables (If Needed)

In Netlify Dashboard:
1. Go to Site settings → Build & Deploy → Environment
2. Add any environment variables your app needs
3. Redeploy site

## Step 4: Continuous Deployment

After initial deployment, every push to your main branch will:
- Trigger an automatic build
- Run production optimizations
- Deploy to live URL

## Deployment Checklist

- [ ] All code committed to Git
- [ ] Build runs successfully locally (`npm run build`)
- [ ] No console errors or warnings
- [ ] All assets load correctly
- [ ] Intro animation works smoothly
- [ ] Category dropdown functions
- [ ] Support dashboard displays correctly
- [ ] Mobile responsive design works

## Build Specifications

- **Build Time**: ~2-3 minutes
- **Artifact Size**: ~500KB-1MB (dist folder)
- **Node Version**: 20
- **Package Manager**: npm

## Performance Optimization

The `netlify.toml` includes:
- Cache headers for static assets (1 year for versioned files)
- Content-Type headers for proper MIME types
- SPA routing redirect (all routes point to index.html)
- Production environment configuration

## Troubleshooting

### Build Fails
```
Check build logs in Netlify Dashboard:
Site settings → Deploys → Click failed deploy → View deploy log
```

### Blank Page After Deployment
- Clear browser cache
- Check browser console for errors
- Verify `dist` folder is published
- Check that all assets have correct paths

### Intro Animation Not Playing
- Check that Framer Motion is properly bundled
- Verify SVG animations work in production
- Check network tab for any failed requests

## Post-Deployment

1. **Custom Domain**:
   - Site settings → Domain management → Add custom domain
   - Follow DNS instructions

2. **SSL Certificate**:
   - Automatic (Let's Encrypt)
   - Renews automatically

3. **Analytics**:
   - Enable Netlify Analytics (optional)
   - View site performance metrics

## Rollback

To rollback to a previous version:
1. Netlify Dashboard → Deploys
2. Find previous successful deploy
3. Click "..." → "Publish deploy"

## Local Testing Before Deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Visit http://localhost:4173
```

---

**Deployment Status**: ✅ Ready for Netlify
**Last Updated**: 2024
