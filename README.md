# ZeroClaw Railway Project

## Overview
ZeroClaw AI Agent powered by Nvidia NIM API with Telegram bot control and full terminal access for admins.

## Features
- 🤖 Multiple LLM Models (Kimi, DeepSeek, GLM-5.1)
- 💬 Telegram Bot Interface (Admin-only)
- 🔧 Full Terminal Access (git, shell commands)
- 🔍 Web Search (Serper API)
- 🚀 Railway Deployment Ready
- 🔄 Dynamic Model Switching

## Quick Start

### Prerequisites
- Node.js 18+
- Docker
- Telegram Bot Token
- Nvidia NIM API Key
- Serper API Key
- Admin Telegram ID

### Installation

```bash
npm install
```

### Environment Variables
Create `.env` file:

```env
# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
ADMIN_IDS=123456789,987654321

# Nvidia NIM API
NVIDIA_NIM_API_KEY=your_nim_api_key
NVIDIA_NIM_BASE_URL=https://integrate.api.nvidia.com/v1

# Serper API
SERPER_API_KEY=your_serper_api_key

# Railway
PORT=3000
NODE_ENV=production
```

### Run

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## Commands

### Telegram Commands
- `/model [name]` - Switch LLM model
- `/chat [prompt]` - Chat with AI
- `/search [query]` - Web search
- `/execute [command]` - Run terminal command (admin only)
- `/models` - List available models
- `/status` - System status

### Available Models
- **Kimi K2.6** - General purpose LLM
- **DeepSeek V4 Pro** - Advanced reasoning
- **GLM-5.1** - Chinese-optimized LLM

## Project Structure

```
zeroclaw-railway/
├── src/
│   ├── index.js                 # Main entry point
│   ├── bot/
│   │   ├── telegram-bot.js      # Telegram bot handler
│   │   └── commands.js          # Command handlers
│   ├── services/
│   │   ├── zeroclaw.js          # ZeroClaw integration
│   │   ├── nvidia-nim.js        # Nvidia NIM API client
│   │   ├── serper.js            # Web search service
│   │   └── terminal.js          # Terminal executor
│   ├── middleware/
│   │   ├── auth.js              # Admin verification
│   │   └── logging.js           # Request logging
│   └── config.js                # Configuration
├── Dockerfile
├── .dockerignore
├── .env.example
├── .gitignore
└── README.md
```

## Deployment

### Railway Deployment

1. Push to GitHub
2. Connect to Railway
3. Set environment variables
4. Deploy

## Security
⚠️ **Admin-only access** for terminal commands
- All requests validated against admin ID whitelist
- API keys stored in Railway environment
- Command sanitization enabled

## License
MIT
