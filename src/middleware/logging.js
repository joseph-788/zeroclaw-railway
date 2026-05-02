import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_DIR = path.join(__dirname, '../../logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

// Create logs directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logLevels = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG',
};

const formatLog = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${message} ${Object.keys(data).length > 0 ? JSON.stringify(data) : ''}`.trim();
};

const writeLog = (level, message, data = {}) => {
  const logMessage = formatLog(level, message, data);
  
  // Console output
  console.log(logMessage);
  
  // File output
  fs.appendFileSync(LOG_FILE, logMessage + '\n', 'utf-8');
};

export const logger = {
  info: (message, data) => writeLog(logLevels.INFO, message, data),
  warn: (message, data) => writeLog(logLevels.WARN, message, data),
  error: (message, data) => writeLog(logLevels.ERROR, message, data),
  debug: (message, data) => writeLog(logLevels.DEBUG, message, data),
};

export const logMiddleware = (ctx, next) => {
  const userId = ctx.from?.id;
  const command = ctx.message?.text || 'unknown';
  
  logger.info(`[Telegram] User: ${userId}`, { command });
  return next();
};

export default logger;
