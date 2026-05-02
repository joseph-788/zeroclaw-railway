import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { config } from '../config.js';
import { logMiddleware, logger } from '../middleware/logging.js';
import { isAdmin } from '../middleware/auth.js';
import { commands } from './commands.js';

class TelegramBot {
  constructor() {
    this.bot = new Telegraf(config.telegram.botToken);
    this.setupMiddleware();
    this.setupHandlers();
  }

  setupMiddleware() {
    // Logging middleware
    this.bot.use(logMiddleware);

    // Admin verification for sensitive commands
    this.bot.use((ctx, next) => {
      const userId = ctx.from?.id;
      const command = ctx.message?.text || '';

      // Log all interactions
      logger.info('Bot Interaction', {
        userId,
        username: ctx.from?.username,
        command: command.substring(0, 50),
      });

      return next();
    });
  }

  setupHandlers() {
    // Start command
    this.bot.command('start', (ctx) => commands.start(ctx));

    // Help command
    this.bot.command('help', (ctx) => commands.help(ctx));

    // Chat command
    this.bot.command('chat', (ctx) => {
      const args = ctx.message.text.replace('/chat', '').trim();
      commands.chat(ctx, args);
    });

    // Model commands
    this.bot.command('model', (ctx) => {
      const args = ctx.message.text.replace('/model', '').trim();
      commands.model(ctx, args);
    });

    this.bot.command('models', (ctx) => commands.models(ctx));
    this.bot.command('current', (ctx) => commands.current(ctx));

    // Search commands
    this.bot.command('search', (ctx) => {
      const args = ctx.message.text.replace('/search', '').trim();
      commands.search(ctx, args);
    });

    this.bot.command('news', (ctx) => {
      const args = ctx.message.text.replace('/news', '').trim();
      commands.news(ctx, args);
    });

    // Admin-only commands
    this.bot.command('execute', (ctx) => {
      if (!isAdmin(ctx.from?.id)) {
        ctx.reply('❌ Unauthorized. Admin only command.');
        return;
      }
      const args = ctx.message.text.replace('/execute', '').trim();
      commands.execute(ctx, args);
    });

    this.bot.command('git', (ctx) => {
      if (!isAdmin(ctx.from?.id)) {
        ctx.reply('❌ Unauthorized. Admin only command.');
        return;
      }
      const args = ctx.message.text.replace('/git', '').trim();
      commands.git(ctx, args);
    });

    this.bot.command('status', (ctx) => commands.status(ctx));

    // Text message handler
    this.bot.on(message('text'), (ctx) => {
      if (!ctx.message.text.startsWith('/')) {
        ctx.reply('ℹ️ Please use commands. Type /help for available commands.');
      }
    });

    // Error handler
    this.bot.catch((error, ctx) => {
      logger.error('Bot Error', {
        error: error.message,
        userId: ctx.from?.id,
      });
      ctx.reply('❌ An error occurred. Please try again.');
    });
  }

  async launch() {
    try {
      logger.info('Launching Telegram Bot...');
      
      // Enable graceful stop
      process.once('SIGINT', () => {
        logger.info('Shutting down bot gracefully...');
        this.bot.stop('SIGINT');
      });

      process.once('SIGTERM', () => {
        logger.info('Shutting down bot gracefully...');
        this.bot.stop('SIGTERM');
      });

      await this.bot.launch();
      logger.info('Telegram Bot launched successfully');
    } catch (error) {
      logger.error('Bot Launch Error', { error: error.message });
      throw error;
    }
  }

  async stop() {
    logger.info('Stopping Telegram Bot...');
    await this.bot.stop();
    logger.info('Telegram Bot stopped');
  }

  getBot() {
    return this.bot;
  }
}

export const telegramBot = new TelegramBot();
export default telegramBot;
