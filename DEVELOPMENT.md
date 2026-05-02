# Development Guide

## Local Development Setup

### Prerequisites
- Node.js 18+
- Git
- Docker (optional, for containerized development)

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/zeroclaw-railway.git
cd zeroclaw-railway

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your API keys
nano .env
```

### Environment Variables (Development)

Required:
- `TELEGRAM_BOT_TOKEN` - Your Telegram bot token
- `ADMIN_IDS` - Your Telegram user ID (comma-separated for multiple)
- `NVIDIA_NIM_API_KEY` - Nvidia NIM API key
- `SERPER_API_KEY` - Serper API key

Optional:
- `NODE_ENV` - Set to 'development' for dev mode
- `LOG_LEVEL` - 'debug' for verbose logging
- `PORT` - Server port (default: 3000)

### Running Locally

**Development Mode (with auto-reload):**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

### Docker Development

**Build Image:**
```bash
docker build -t zeroclaw-railway .
```

**Run Container:**
```bash
docker run -p 3000:3000 \
  -e TELEGRAM_BOT_TOKEN=your_token \
  -e ADMIN_IDS=123456789 \
  -e NVIDIA_NIM_API_KEY=your_key \
  -e SERPER_API_KEY=your_key \
  zeroclaw-railway
```

**Using Docker Compose:**
```bash
docker-compose up
```

## Project Structure

```
src/
├── index.js                 # Main entry point
├── config.js                # Configuration management
├── bot/
│   ├── telegram-bot.js      # Telegram bot initialization
│   └── commands.js          # Command handlers
├── services/
│   ├── nvidia-nim.js        # Nvidia NIM API client
│   ├── serper.js            # Serper search service
│   ├── terminal.js          # Shell command executor
│   └── zeroclaw.js          # ZeroClaw integration
└── middleware/
    ├── auth.js              # Admin authentication
    └── logging.js           # Logging system
```

## Testing Commands

### Chat Command
```
/chat Write a Python script to sort a list
```

### Model Switching
```
/models                    # List all models
/model deepseek-v4-pro     # Switch to DeepSeek
/current                   # Show current model
```

### Web Search
```
/search artificial intelligence news
/news AI breakthroughs
```

### Terminal (Admin Only)
```
/execute ls -la
/execute pwd
/git status
/git log --oneline
```

### System Info
```
/status                    # Show system status
```

## Adding New Features

### New Command
1. Add handler in `src/bot/commands.js`
2. Register in `src/bot/telegram-bot.js`
3. Add middleware/auth as needed

### New Service
1. Create `src/services/my-service.js`
2. Export service class
3. Import and use in commands

### New Middleware
1. Create `src/middleware/my-middleware.js`
2. Register in `src/bot/telegram-bot.js` or `src/index.js`

## Debugging

### Enable Debug Logging
```bash
LOG_LEVEL=debug npm run dev
```

### Check Logs
```bash
tail -f logs/app.log
```

### Test API Directly
```bash
curl http://localhost:3000/health

curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello"}'
```

## Common Issues

### Bot Not Starting
- Check `TELEGRAM_BOT_TOKEN` is correct
- Verify admin IDs are set
- Check network connectivity

### API Errors
- Verify API keys are correct
- Check rate limits
- Review error logs

### Memory Issues
- Monitor with `top` or `docker stats`
- Check log file size and rotate if needed
- Optimize large responses

## Performance Tips

1. **Caching**: Implement response caching for frequent queries
2. **Rate Limiting**: Throttle API calls to avoid rate limits
3. **Connection Pooling**: Reuse HTTP connections
4. **Async Operations**: Use async/await for non-blocking operations

## Deployment to Railway

See `RAILWAY_DEPLOYMENT.md` for detailed instructions.

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes and commit: `git commit -am "Add feature"`
3. Push to GitHub: `git push origin feature/my-feature`
4. Create Pull Request

## Support

For issues and questions:
1. Check logs with `tail -f logs/app.log`
2. Review error messages in Railway dashboard
3. Check API documentation:
   - Telegram Bot: https://core.telegram.org/bots
   - Nvidia NIM: https://build.nvidia.com/
   - Serper: https://serper.dev/docs
