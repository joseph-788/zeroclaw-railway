import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Telegram
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    adminIds: (process.env.ADMIN_IDS || '').split(',').map(id => parseInt(id.trim())),
  },

  // Nvidia NIM API
  nvidia: {
    apiKey: process.env.NVIDIA_NIM_API_KEY,
    baseUrl: process.env.NVIDIA_NIM_BASE_URL || 'https://integrate.api.nvidia.com/v1',
    defaultModel: process.env.DEFAULT_MODEL || 'meta-llama-3.1-405b-instruct',
  },

  // Serper API
  serper: {
    apiKey: process.env.SERPER_API_KEY,
  },

  // Server
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },

  // Available Models
  models: {
    'kimi-k2.6': {
      name: 'Kimi K2.6',
      provider: 'nvidia-nim',
      modelId: 'kimi-k2.6',
      description: 'General purpose LLM',
    },
    'deepseek-v4-pro': {
      name: 'DeepSeek V4 Pro',
      provider: 'nvidia-nim',
      modelId: 'deepseek-v4-pro',
      description: 'Advanced reasoning capabilities',
    },
    'glm-5.1': {
      name: 'GLM-5.1',
      provider: 'nvidia-nim',
      modelId: 'glm-5.1',
      description: 'Chinese-optimized LLM',
    },
  },

  // Safety & Rate Limiting
  rateLimit: {
    windowMs: 60000, // 1 minute
    maxRequests: 30,
  },

  // Logging
  logging: {
    enabled: true,
    logLevel: process.env.LOG_LEVEL || 'info',
  },
};

export default config;
