# Vercel Deployment Guide

## 🚀 Deploy Frontend to Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com) and login**

2. **Import your GitHub repository:**
   - Click "Add New Project"
   - Select your repository: `devxkamlesh/ghumophiroindia`

3. **Configure Project Settings:**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variables:**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
   ```

5. **Click "Deploy"**

---

### Option 2: Via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from frontend folder:**
   ```bash
   cd frontend
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **ghumophiro-frontend**
   - In which directory is your code located? **.**
   - Want to override settings? **N**

5. **Add environment variables:**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   ```
   Enter: `https://your-backend-url.com/api/v1`

6. **Deploy to production:**
   ```bash
   vercel --prod
   ```

---

## 🔧 Important Configuration

### Root Directory Setting
**CRITICAL:** In Vercel project settings, set:
```
Root Directory: frontend
```

This tells Vercel that your Next.js app is in the `frontend` folder, not the root.

### Build Settings
```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Development Command: npm run dev
```

---

## 🌐 Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

### Required:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1
```

### Optional (if using):
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_ANALYTICS_ID=your_id_here
```

---

## 🔄 Automatic Deployments

Once configured, Vercel will automatically deploy:
- **Production:** Every push to `main` branch
- **Preview:** Every pull request

---

## 🐛 Troubleshooting

### Error: ".next directory not found"
**Solution:** Set Root Directory to `frontend` in project settings

### Error: "Build failed"
**Solution:** Check build logs and ensure all dependencies are in `frontend/package.json`

### Error: "API calls failing"
**Solution:** Verify `NEXT_PUBLIC_API_URL` environment variable is set correctly

### Error: "Module not found"
**Solution:** 
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` in frontend folder
3. Commit and push changes

---

## 📝 Post-Deployment Checklist

- [ ] Frontend deployed successfully
- [ ] Environment variables configured
- [ ] API URL points to backend
- [ ] Test all pages load correctly
- [ ] Test API integration
- [ ] Check console for errors
- [ ] Verify images load properly
- [ ] Test mobile responsiveness

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Next.js on Vercel:** https://vercel.com/docs/frameworks/nextjs

---

## 🎯 Next Steps

After deploying frontend:

1. **Deploy Backend** to Railway/Render/Fly.io
2. **Update Environment Variables** with backend URL
3. **Test Full Application** end-to-end
4. **Set up Custom Domain** (optional)
5. **Configure Analytics** (optional)
