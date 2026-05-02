import { config } from '../config.js';

export const isAdmin = (userId) => {
  return config.telegram.adminIds.includes(userId);
};

export const requireAdmin = (ctx, next) => {
  const userId = ctx.from?.id;
  
  if (!isAdmin(userId)) {
    ctx.reply('❌ Unauthorized. Admin access required.');
    console.warn(`Unauthorized access attempt from user ${userId}`);
    return;
  }
  
  return next();
};

export const adminCheck = (userId) => {
  return config.telegram.adminIds.includes(userId);
};

export default { isAdmin, requireAdmin, adminCheck };
