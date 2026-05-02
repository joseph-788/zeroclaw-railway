# 📋 Deployment Checklist

## Pre-Deployment ✅

- [ ] Repository created locally: `/home/md_akhan8798/zeroclaw-railway`
- [ ] All dependencies installed: `npm install` completed
- [ ] Git initialized with commit history
- [ ] Environment template created: `.env.example`
- [ ] Dockerfile created and tested locally
- [ ] Docker Compose file for local development
- [ ] All documentation complete
- [ ] Project structure verified

## Before Deploying to Railway

### 1. GitHub Setup
- [ ] Create GitHub repository
- [ ] Push local repository to GitHub:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/zeroclaw-railway.git
  git branch -M main
  git push -u origin main
  ```

### 2. API Keys Preparation
Gather these before Railway deployment:
- [ ] **Telegram Bot Token**
  - Chat @BotFather on Telegram
  - Command: `/newbot`
  - Copy the API token

- [ ] **Nvidia NIM API Key**
  - Visit https://build.nvidia.com/
  - Sign up or log in
  - Go to API Keys section
  - Create and copy new key

- [ ] **Serper API Key**
  - Visit https://serper.dev
  - Sign up
  - Go to API section
  - Copy your key

- [ ] **Admin Telegram ID**
  - Message @userinfobot on Telegram
  - Send `/start`
  - Copy your user ID

- [ ] **Railway Account**
  - Create account at https://railway.app
  - Verify email

## Railway Deployment Steps

### 1. Connect GitHub to Railway
- [ ] Go to https://railway.app
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub"
- [ ] Authorize GitHub
- [ ] Select `zeroclaw-railway` repository

### 2. Add Environment Variables
In Railway Dashboard → Variables tab, add:

```
TELEGRAM_BOT_TOKEN=<your_telegram_token>
ADMIN_IDS=<your_telegram_id>
NVIDIA_NIM_API_KEY=<your_nvidia_key>
NVIDIA_NIM_BASE_URL=https://integrate.api.nvidia.com/v1
SERPER_API_KEY=<your_serper_key>
DEFAULT_MODEL=meta-llama-3.1-405b-instruct
NODE_ENV=production
PORT=3000
```

- [ ] All variables entered correctly
- [ ] No typos in keys
- [ ] Each variable has correct value

### 3. Deploy
- [ ] Click "Deploy" button
- [ ] Monitor build logs
- [ ] Wait for deployment to complete
- [ ] Check for any error messages

## Post-Deployment Verification ✅

### 1. Health Check
- [ ] Visit: `https://your-railway-url.railway.app/health`
- [ ] Should return: `{"status":"ok", ...}`

### 2. Telegram Bot Test
- [ ] Open Telegram
- [ ] Find your bot (from @BotFather setup)
- [ ] Send `/start` command
- [ ] Verify welcome message received

### 3. Command Testing
- [ ] `/help` - Should show commands
- [ ] `/models` - Should list 3 models
- [ ] `/current` - Should show model
- [ ] `/chat Hello` - Should respond
- [ ] `/search test` - Should return results

### 4. Admin Commands (Your ID)
- [ ] `/status` - Should show system info
- [ ] `/execute ls` - Should show directory listing
- [ ] `/git status` - Should show git status

### 5. Monitor Logs
- [ ] Check Railway dashboard logs
- [ ] Look for any errors
- [ ] Verify user requests are logged

## Troubleshooting Checklist

If something doesn't work:

### Bot Not Responding
- [ ] Check TELEGRAM_BOT_TOKEN in Railway variables
- [ ] Verify token is correct from @BotFather
- [ ] Check Railway logs for errors
- [ ] Verify your admin ID in ADMIN_IDS

### API Errors
- [ ] Check Nvidia NIM API key format
- [ ] Verify API key has proper permissions
- [ ] Check Serper API key is valid
- [ ] Ensure base URL is correct

### Build Failures
- [ ] Check build logs in Railway
- [ ] Verify all environment variables are set
- [ ] Check Node.js version (18+)
- [ ] Verify package.json is valid

### Memory/Performance Issues
- [ ] Monitor Railway dashboard
- [ ] Check if Railway auto-scaled up
- [ ] Review logs for large requests
- [ ] Optimize response handling

## Post-Deployment Configuration (Optional)

### 1. Custom Domain
- [ ] Go to Railway Settings
- [ ] Add custom domain
- [ ] Configure DNS records
- [ ] Update bot webhook if needed

### 2. Database (For Future Features)
- [ ] Add PostgreSQL plugin in Railway
- [ ] Store connection string
- [ ] Ready for chat history persistence

### 3. Monitoring
- [ ] Set up log alerts in Railway
- [ ] Monitor CPU/Memory usage
- [ ] Enable performance monitoring

## Scaling & Optimization

- [ ] Monitor API rate limits
- [ ] Check response times
- [ ] Review Railway metrics
- [ ] Scale if needed (Railway auto-scales)

## Documentation Updates

- [ ] Update DEVELOPMENT.md with Railway URL
- [ ] Update bot link in README
- [ ] Document any custom configurations
- [ ] Add deployment date and version

## Backup & Maintenance

- [ ] Backup Railway configuration
- [ ] Document environment variables
- [ ] Keep API keys secure
- [ ] Plan for log rotation

---

## ✨ Deployment Complete!

Once all items are checked:
1. Bot is live and responding
2. Commands are functional
3. Logging is working
4. System is production-ready
5. You can add users to ADMIN_IDS for new admins

## 🚀 You're Live!

Your ZeroClaw Railway project is now deployed and ready to use!

---

**Created**: May 2, 2026
**Version**: 1.0.0
**Status**: Ready for Deployment ✅
