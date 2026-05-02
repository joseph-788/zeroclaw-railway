# Railway Deployment Guide

## Prerequisites
- Railway Account (https://railway.app)
- GitHub Repository (where your code is pushed)
- The following API Keys:
  - Telegram Bot Token
  - Nvidia NIM API Key
  - Serper API Key
  - Admin Telegram IDs

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/zeroclaw-railway.git
git branch -M main
git push -u origin main
```

### 2. Connect to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Authorize GitHub and select this repository

### 3. Add Environment Variables

In Railway Dashboard:
1. Go to Variables tab
2. Add the following environment variables:

```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
ADMIN_IDS=123456789,987654321
NVIDIA_NIM_API_KEY=your_nvidia_nim_api_key
NVIDIA_NIM_BASE_URL=https://integrate.api.nvidia.com/v1
SERPER_API_KEY=your_serper_api_key
DEFAULT_MODEL=meta-llama-3.1-405b-instruct
NODE_ENV=production
PORT=3000
```

### 4. Deploy

Click "Deploy" button in Railway dashboard. The app will automatically:
- Build Docker image
- Deploy to Railway infrastructure
- Scale as needed

### 5. Verify Deployment

1. Check build logs in Railway dashboard
2. Get the public URL from Railway
3. Test health endpoint: `https://your-railway-url.railway.app/health`
4. Test in Telegram: Send `/start` command to your bot

## Getting API Keys

### Telegram Bot Token
1. Chat with @BotFather on Telegram
2. Click /newbot
3. Follow the prompts
4. Copy the token

### Nvidia NIM API Key
1. Go to https://build.nvidia.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create new API key
5. Copy the key

### Serper API Key
1. Go to https://serper.dev
2. Sign up
3. Go to API Key section
4. Copy the key

## Monitoring

### Logs
Railway dashboard shows real-time logs from your application.

### Metrics
Monitor CPU, Memory, and Network usage in Railway dashboard.

## Troubleshooting

### Bot Not Responding
- Check if TELEGRAM_BOT_TOKEN is correct
- Verify ADMIN_IDS are set
- Check Railway logs for errors

### API Rate Limiting
- Check Nvidia NIM API quota
- Check Serper API quota
- Monitor logs for rate limit errors

### Memory Issues
- Railway provides auto-scaling
- Monitor memory usage in dashboard
- Optimize large responses

## Advanced Configuration

### Custom Domain
1. Go to Settings in Railway project
2. Add custom domain
3. Configure DNS records

### Database (Optional)
- Railway supports PostgreSQL
- Can be added for persistence
- Useful for storing chat history

### GitHub Auto-Deploy
- Railway automatically deploys on push to main branch
- Disable with settings if needed

## Scaling
Railway automatically scales your app based on load.
Monitor usage in the dashboard.

## Support
- Railway Docs: https://docs.railway.app
- Email: support@railway.app
