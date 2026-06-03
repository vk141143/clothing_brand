# Netlify Environment Variables Setup

## 🔧 How to Configure Environment Variables in Netlify

### Step 1: Access Environment Settings

1. Log in to Netlify Dashboard
2. Select your site
3. Go to **Site settings**
4. Click **Build & deploy**
5. Select **Environment**

### Step 2: Add Environment Variables

Click "Edit variables" and add the following:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Node environment |
| `VITE_APP_NAME` | `CraftMySarees` | Application name |
| `VITE_ENABLE_ANIMATIONS` | `true` | Enable intro animations |
| `VITE_ENABLE_INTRO` | `true` | Show intro on page load |
| `VITE_DEBUG_MODE` | `false` | Debug logging |

### Step 3: Apply Changes

1. Click "Save"
2. Redeploy your site to apply changes
3. Check deployment logs to verify

## 🚀 Deploy Variables

For different environments:

### Production Deployment
```
NODE_ENV=production
VITE_DEBUG_MODE=false
VITE_ENABLE_INTRO=true
```

### Preview/Staging
```
NODE_ENV=development
VITE_DEBUG_MODE=true
VITE_ENABLE_INTRO=true
```

## 📝 Local Testing

Create `.env.local` in project root:

```bash
# Copy from .env.example
cp .env.example .env.local

# Edit as needed
# Then run:
npm run dev
```

## 🔐 Sensitive Data

For sensitive variables (API keys, passwords):

1. Go to **Site settings → Build & deploy → Environment**
2. Add as encrypted variables
3. Netlify automatically encrypts sensitive data
4. Variables available to build process only

⚠️ **Never commit `.env.local` to Git**
- Already in `.gitignore`
- Add to Netlify dashboard instead

## 🔄 Build-Time Environment Variables

The build process uses environment variables to:
- Configure feature flags
- Set debugging options
- Control animation behavior
- Customize brand settings

## ✅ Verification

After deployment:

1. Check deploy logs: `Netlify Dashboard → Deploys → View log`
2. Search for "Build-time environment variables"
3. Verify all variables are loaded correctly

## 📋 Example Netlify Dashboard Setup

```
Build & deploy → Environment → Edit variables

NODE_ENV: production
VITE_APP_NAME: CraftMySarees
VITE_ENABLE_ANIMATIONS: true
VITE_ENABLE_INTRO: true
VITE_DEBUG_MODE: false
VITE_APP_DESCRIPTION: Premium Indian Saree E-Commerce Store
```

## 🆘 Troubleshooting

### Variables Not Working

1. **Clear build cache**: 
   - Site settings → Build & deploy → Clear cache and redeploy

2. **Check variable names**: 
   - Must match exactly (case-sensitive)
   - VITE_* prefix required for client-side variables

3. **Verify variables in logs**: 
   - Deploy log shows environment setup

### Animation Not Playing

Check if `VITE_ENABLE_INTRO=true` in production environment

### Debug Mode

Set `VITE_DEBUG_MODE=true` to see console logs

---

**All set for Netlify deployment!** 🎉
