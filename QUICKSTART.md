# Quick Start Guide - ZeroClaw Railway

## 5-Minute Setup

### 1. Get Your API Keys
- **Telegram Bot**: Chat @BotFather → `/newbot` → Copy token
- **Nvidia NIM**: https://build.nvidia.com/ → API Keys → Create key
- **Serper**: https://serper.dev → Sign up → Copy API key
- **Your Telegram ID**: https://t.me/userinfobot → Send /start

### 2. Local Testing (Optional)

```bash
cd zeroclaw-railway
cp .env.example .env

# Edit .env with your keys
nano .env

# Run locally
npm install
npm start
```

Test in Telegram: `/start`

### 3. Deploy to Railway (Recommended)

```bash
# Push to GitHub (create repo first)
git remote add origin https://github.com/YOUR_USERNAME/zeroclaw-railway.git
git push -u origin main
```

Then:
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select this repository
4. Add environment variables (from .env.example)
5. Deploy! 🚀

## Available Commands

### Chat & Models
```
/chat <prompt>          - Chat with AI
/models                 - List available models
/model <name>          - Switch model
/current               - Show current model
```

### Search
```
/search <query>        - Web search
/news <query>          - News search
```

### Admin Terminal (Your ID: see .env ADMIN_IDS)
```
/execute <command>     - Run shell command
/git <args>            - Run git command
/status                - System status
```

## Available Models

1. **Kimi K2.6** - General purpose
2. **DeepSeek V4 Pro** - Advanced reasoning
3. **GLM-5.1** - Chinese-optimized

Switch with: `/model deepseek-v4-pro`

## Troubleshooting

**Bot not responding?**
- Check TELEGRAM_BOT_TOKEN in Railway variables
- Check ADMIN_IDS contains your ID
- View logs in Railway dashboard

**API errors?**
- Verify NVIDIA_NIM_API_KEY is correct
- Check Serper API quota at serper.dev
- Check API key formatting in .env

## Full Documentation

- **Deployment**: See `RAILWAY_DEPLOYMENT.md`
- **Development**: See `DEVELOPMENT.md`
- **README**: See `README.md`

## What's Included

✅ **ZeroClaw Integration** - AI agent framework
✅ **Multiple LLM Models** - Kimi, DeepSeek, GLM
✅ **Telegram Bot** - Admin control with `/commands`
✅ **Terminal Access** - Full shell & git commands for admin
✅ **Web Search** - Google search via Serper API
✅ **Logging** - Comprehensive request/error logging
✅ **Docker Ready** - Containerized for Railway
✅ **Production Ready** - Health checks, error handling, auto-scaling

## Next Steps

1. ✅ Get API keys
2. ✅ Test locally or deploy to Railway
3. ✅ Send `/start` command to your bot
4. ✅ Switch models with `/model [name]`
5. ✅ Try commands: `/chat`, `/search`, `/execute`

## Support

- Telegram Bot Docs: https://core.telegram.org/bots
- Nvidia NIM: https://build.nvidia.com/
- Serper: https://serper.dev/docs
- Railway: https://docs.railway.app

---

**Version**: 1.0.0
**License**: MIT
**Powered by**: Claude Copilot
