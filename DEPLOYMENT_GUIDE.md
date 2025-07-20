# 🚀 Deployment Guide - Skill Swap Platform

## 📋 Pre-Deployment Checklist

### ✅ Code Preparation
- [x] All changes committed and pushed to GitHub
- [x] Production build scripts added
- [x] Static file serving configured for production
- [x] Environment variables template created
- [x] CORS settings updated for production

### ✅ MongoDB Atlas Setup
- [x] MongoDB Atlas cluster is running
- [x] Database user credentials are working
- [x] Network access is configured (0.0.0.0/0 or specific IPs)
- [x] Connection string is URL-encoded

### ✅ Email Service
- [x] Gmail App Password is generated
- [x] Email templates are tested
- [x] Email service is working locally

---

## 🛤️ Railway Deployment (Recommended)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account
3. Authorize Railway to access your repositories

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `skill-swap` repository
4. Railway will automatically detect it's a Node.js project

### Step 3: Configure Environment Variables
Add these environment variables in Railway dashboard Variables tab:

**CRITICAL: Use these EXACT values:**

```env
NODE_ENV=production
PORT=8080
MONGO_URI=mongodb+srv://gyan995518:Gyan29102003%23%40123@skillswap-cluster.ogd5rcr.mongodb.net/skillswap?retryWrites=true&w=majority
JWT_SECRET=MySuper$ecur3JWT$ecretK3yForProduction2024!
EMAIL_USER=thesiliconsavants@gmail.com
EMAIL_PASS=mgep ewfj tqcy dpxd
CLIENT_URL=https://skill-swap-production.up.railway.app
```

**⚠️ Common MongoDB URI Mistakes:**
- ❌ Wrong: `gyansuperuser` → ✅ Correct: `gyan995518` 
- ❌ Wrong: `Gyan%40123` → ✅ Correct: `Gyan29102003%23%40123`
- ❌ Wrong: Missing `/skillswap` database name
- ❌ Wrong: Including `&appName=skillswap-cluster`

### Step 4: Generate Domain & Deploy
1. Click "Generate Domain" in the Networking section to get your public URL
2. Copy the generated URL (e.g., `https://skill-swap-production-abc123.up.railway.app`)
3. Update the `CLIENT_URL` environment variable with your actual URL
4. Railway will automatically build and deploy your app
5. Wait for deployment to complete (usually 2-5 minutes)

---

## 🌐 Alternative: Vercel (Frontend) + Railway (Backend)

### Frontend on Vercel:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set build command: `cd client && npm run build`
4. Set output directory: `client/build`
5. Add environment variables for API calls

### Backend on Railway:
1. Deploy only the backend code
2. Update frontend to point to Railway API URL

---

## 🔧 Heroku Deployment (Alternative)

### Step 1: Install Heroku CLI
```bash
# Install Heroku CLI from heroku.com/cli
heroku --version
```

### Step 2: Login and Create App
```bash
heroku login
heroku create your-skill-swap-app
```

### Step 3: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI="your-mongodb-atlas-uri"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set EMAIL_USER="thesiliconsavants@gmail.com"
heroku config:set EMAIL_PASS="mgep ewfj tqcy dpxd"
heroku config:set CLIENT_URL="https://your-skill-swap-app.herokuapp.com"
```

### Step 4: Deploy
```bash
git push heroku main
```

---

## 🔍 Post-Deployment Testing

### ✅ Test These Features:
1. **Homepage** - Check if the site loads
2. **Registration** - Create a new account
3. **Email** - Verify welcome email is sent
4. **Login** - Test authentication
5. **Profile** - Update profile and upload images
6. **Search** - Browse users and skills
7. **Swap Requests** - Send and receive requests
8. **Email Notifications** - Test swap request emails
9. **Password Reset** - Test forgot password flow
10. **Admin** - Access admin dashboard with admin account

### 🐛 Common Issues and Solutions:

**Issue: MongoDB Connection Error**
- Solution: Check if your IP is whitelisted in MongoDB Atlas
- Solution: Verify connection string is correct and URL-encoded

**Issue: Email Not Sending**
- Solution: Verify Gmail App Password is correct
- Solution: Check if 2FA is enabled on Gmail account

**Issue: Build Fails - "react-scripts: not found"**
- Solution: Client dependencies aren't installed - this is fixed with our nixpacks.toml configuration
- Solution: Railway should now properly install both root and client dependencies
- Solution: Make sure both package.json files are committed to Git

**Issue: Railway Build Fails**
- Solution: Check the build logs in Railway dashboard under "Deployments"
- Solution: Ensure Dockerfile is properly configured (we've added this)
- Solution: Verify nixpacks.toml is correctly set up for monorepo structure

**Issue: Environment Variables Not Working**
- Solution: Make sure all variables are added in Railway Variables tab
- Solution: Ensure CLIENT_URL matches your actual Railway domain
- Solution: Check that MONGO_URI is properly URL-encoded

**Issue: 404 on Refresh**
- Solution: Ensure static file serving is configured for React Router
- Solution: Verify Dockerfile properly builds and serves React files

---

## 📊 Monitoring and Maintenance

### Set Up Monitoring:
- Enable application logs in your deployment platform
- Monitor database performance in MongoDB Atlas
- Set up error tracking (optional: Sentry integration)

### Regular Maintenance:
- Update dependencies regularly
- Monitor email service usage
- Check database storage usage
- Review application logs for errors

---

## 🎉 Congratulations!

Your Skill Swap platform is now live and ready for users!

**Next Steps:**
1. Share your app URL with friends for testing
2. Monitor the application for any issues
3. Consider adding a custom domain
4. Set up automated backups for your database
5. Plan for scaling as your user base grows

**Your app will be available at:**
- Railway: `https://skill-swap-production.up.railway.app`
- Heroku: `https://your-app-name.herokuapp.com`
- Vercel: `https://your-app-name.vercel.app`

---

## 🌟 **Live Demo**

**🚀 Live Application:** [https://skill-swap-production.up.railway.app](https://skill-swap-production.up.railway.app)

**👑 Admin Access:**
- Email: `thesiliconsavants@gmail.com`
- Password: `Gyan123@`
- Admin Dashboard: [https://skill-swap-production.up.railway.app/admin](https://skill-swap-production.up.railway.app/admin)
