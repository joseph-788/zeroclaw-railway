import express from 'express';
import { config } from './config.js';
import { logger } from './middleware/logging.js';
import { telegramBot } from './bot/telegram-bot.js';

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
  });
});

// API endpoint for testing
app.post('/api/chat', express.json(), async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    logger.info('API Chat Request', { prompt: prompt.substring(0, 50) });
    
    const { nvidiaClient } = await import('./services/nvidia-nim.js');
    const response = await nvidiaClient.chat(prompt);
    
    res.json({ success: true, response });
  } catch (error) {
    logger.error('API Error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// API endpoint for model list
app.get('/api/models', (req, res) => {
  const { nvidiaClient } = await import('./services/nvidia-nim.js');
  const models = nvidiaClient.getAvailableModels();
  res.json({ models });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
async function start() {
  try {
    // Verify environment
    if (!config.telegram.botToken) {
      throw new Error('TELEGRAM_BOT_TOKEN not set');
    }

    if (!config.nvidia.apiKey) {
      throw new Error('NVIDIA_NIM_API_KEY not set');
    }

    if (!config.telegram.adminIds || config.telegram.adminIds.length === 0) {
      throw new Error('ADMIN_IDS not set');
    }

    logger.info('ZeroClaw AI Agent Starting...', {
      nodeEnv: config.server.nodeEnv,
      port: config.server.port,
      admins: config.telegram.adminIds.length,
    });

    // Start Express server
    app.listen(config.server.port, () => {
      logger.info(`HTTP Server running on port ${config.server.port}`);
    });

    // Launch Telegram bot
    await telegramBot.launch();

    logger.info('✅ ZeroClaw AI Agent Ready');
  } catch (error) {
    logger.error('Startup Error', { error: error.message });
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message });
  process.exit(1);
});

start();

export default app;
