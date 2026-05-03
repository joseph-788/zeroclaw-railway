import { nvidiaClient } from '../services/nvidia-nim.js';
import { serperService } from '../services/serper.js';
import { terminalService } from '../services/terminal.js';
import { zeroClawService } from '../services/zeroclaw.js';
import { logger } from '../middleware/logging.js';
import { isAdmin } from '../middleware/auth.js';

export const commands = {
  start: async (ctx) => {
    const userId = ctx.from?.id;
    logger.info('Command: start', { userId });

    ctx.reply(`
🤖 *Welcome to ZeroClaw AI Agent*

I'm an AI assistant powered by Nvidia NIM API with full terminal access.

*How it works:*
Just send me any message and I'll respond with AI-powered answers!

*Available Commands:*
/model [name] - Switch model
/models - List available models
/search <query> - Web search
/news <query> - News search
/execute <command> - Run terminal command (admin only)
/status - System status
/help - Show help

*Admin ID:* ${userId}
    `, { parse_mode: 'Markdown' });
  },

  help: async (ctx) => {
    ctx.reply(`
📖 *ZeroClaw AI Agent Help*

*Chat:*
Just send any message directly - it will be processed by the AI

*Model Management:*
/model [name] - Switch to model (kimi-k2.6, deepseek-v4-pro, glm-5.1)
/models - List all available models
/current - Show current model

*Search Commands:*
/search <query> - Google search via Serper
/news <query> - News search

*System Commands (Admin Only):*
/execute <command> - Run shell command
/git <args> - Run git command
/status - System status

*Examples:*
Just type: "Write a Python script to sort a list"
/model deepseek-v4-pro
/search artificial intelligence latest news
/execute ls -la /home
/git status
    `, { parse_mode: 'Markdown' });
  },

  chat: async (ctx, args) => {
    const userId = ctx.from?.id;
    if (!args) {
      ctx.reply('❌ Please provide a prompt. Usage: /chat <prompt>');
      return;
    }

    logger.info('Command: chat', { userId, prompt: args.substring(0, 50) });

    try {
      ctx.reply('⏳ Thinking...');
      const response = await nvidiaClient.chat(args);
      
      const chunks = response.match(/[\s\S]{1,4000}/g) || [response];
      for (const chunk of chunks) {
        await ctx.reply(chunk, { parse_mode: 'Markdown' });
      }
    } catch (error) {
      logger.error('Chat Error', { userId, error: error.message });
      ctx.reply(`❌ Error: ${error.message}`);
    }
  },

  model: async (ctx, args) => {
    const userId = ctx.from?.id;
    logger.info('Command: model', { userId, model: args });

    if (!args) {
      const current = nvidiaClient.getCurrentModel();
      ctx.reply(`Current model: *${current}*\n\nUse: /model [name] to switch`, { parse_mode: 'Markdown' });
      return;
    }

    if (nvidiaClient.setModel(args)) {
      ctx.reply(`✅ Switched to model: *${args}*`, { parse_mode: 'Markdown' });
    } else {
      ctx.reply(`❌ Model not found. Use /models to see available models`);
    }
  },

  models: async (ctx) => {
    const userId = ctx.from?.id;
    logger.info('Command: models', { userId });

    const models = nvidiaClient.getAvailableModels();
    let message = '🤖 *Available Models:*\n\n';
    
    models.forEach(model => {
      message += `• *${model.name}* (${model.id})\n  ${model.description}\n\n`;
    });

    message += 'Use: /model [id] to switch';
    ctx.reply(message, { parse_mode: 'Markdown' });
  },

  current: async (ctx) => {
    const userId = ctx.from?.id;
    logger.info('Command: current', { userId });

    const current = nvidiaClient.getCurrentModel();
    ctx.reply(`🤖 Current Model: *${current}*`, { parse_mode: 'Markdown' });
  },

  search: async (ctx, args) => {
    const userId = ctx.from?.id;
    if (!args) {
      ctx.reply('❌ Please provide search query. Usage: /search <query>');
      return;
    }

    logger.info('Command: search', { userId, query: args });

    try {
      ctx.reply('🔍 Searching...');
      const results = await serperService.search(args, { num: 5 });
      const formatted = await serperService.formatSearchResults(results);
      
      const chunks = formatted.match(/[\s\S]{1,4000}/g) || [formatted];
      for (const chunk of chunks) {
        await ctx.reply(chunk, { parse_mode: 'Markdown' });
      }
    } catch (error) {
      logger.error('Search Error', { userId, error: error.message });
      ctx.reply(`❌ Search Error: ${error.message}`);
    }
  },

  news: async (ctx, args) => {
    const userId = ctx.from?.id;
    if (!args) {
      ctx.reply('❌ Please provide news query. Usage: /news <query>');
      return;
    }

    logger.info('Command: news', { userId, query: args });

    try {
      ctx.reply('📰 Searching news...');
      const results = await serperService.news(args, { num: 5 });
      
      let message = '📰 *News Results:*\n\n';
      results.forEach((result, index) => {
        message += `${index + 1}. *${result.title}*\n`;
        message += `   Source: ${result.source}\n`;
        message += `   Date: ${result.date}\n`;
        message += `   Link: ${result.link}\n\n`;
      });

      ctx.reply(message, { parse_mode: 'Markdown' });
    } catch (error) {
      logger.error('News Error', { userId, error: error.message });
      ctx.reply(`❌ Error: ${error.message}`);
    }
  },

  execute: async (ctx, args) => {
    const userId = ctx.from?.id;
    if (!isAdmin(userId)) {
      ctx.reply('❌ Unauthorized. Admin only command.');
      return;
    }

    if (!args) {
      ctx.reply('❌ Please provide a command. Usage: /execute <command>');
      return;
    }

    logger.info('Command: execute', { userId, command: args });

    try {
      ctx.reply('⏳ Executing...');
      const result = await terminalService.execute(args, userId);
      
      if (result.success) {
        const output = `\`\`\`\n${result.output}\n\`\`\``;
        const chunks = output.match(/[\s\S]{1,4000}/g) || [output];
        for (const chunk of chunks) {
          await ctx.reply(chunk, { parse_mode: 'Markdown' });
        }
      } else {
        ctx.reply(`❌ Error:\n\`\`\`\n${result.error}\n\`\`\``);
      }
    } catch (error) {
      logger.error('Execute Error', { userId, error: error.message });
      ctx.reply(`❌ Error: ${error.message}`);
    }
  },

  git: async (ctx, args) => {
    const userId = ctx.from?.id;
    if (!isAdmin(userId)) {
      ctx.reply('❌ Unauthorized. Admin only command.');
      return;
    }

    if (!args) {
      ctx.reply('❌ Please provide git arguments. Usage: /git <args>');
      return;
    }

    logger.info('Command: git', { userId, args });

    try {
      ctx.reply('⏳ Running git command...');
      const result = await terminalService.gitCommand(args, userId);
      
      if (result.success) {
        const output = `\`\`\`\n${result.output}\n\`\`\``;
        const chunks = output.match(/[\s\S]{1,4000}/g) || [output];
        for (const chunk of chunks) {
          await ctx.reply(chunk, { parse_mode: 'Markdown' });
        }
      } else {
        ctx.reply(`❌ Error:\n\`\`\`\n${result.error}\n\`\`\``);
      }
    } catch (error) {
      logger.error('Git Error', { userId, error: error.message });
      ctx.reply(`❌ Error: ${error.message}`);
    }
  },

  status: async (ctx) => {
    const userId = ctx.from?.id;
    logger.info('Command: status', { userId });

    try {
      const zeroClawStatus = await zeroClawService.getStatus();
      const sysInfo = await terminalService.getSystemInfo();
      const currentModel = nvidiaClient.getCurrentModel();

      let message = '📊 *System Status*\n\n';
      message += `🤖 Model: ${currentModel}\n`;
      message += `🔧 ZeroClaw: ${zeroClawStatus.ready ? '✅ Ready' : '⚠️ Not Ready'}\n`;
      
      if (!sysInfo.error) {
        message += `🖥️ Hostname: ${sysInfo.hostname}\n`;
        message += `⏱️ Uptime: ${sysInfo.uptime}\n`;
        message += `💾 Disk: ${sysInfo.diskSpace}\n`;
      }

      ctx.reply(message, { parse_mode: 'Markdown' });
    } catch (error) {
      logger.error('Status Error', { userId, error: error.message });
      ctx.reply(`❌ Error: ${error.message}`);
    }
  },
};

export default commands;
