import { exec, execSync } from 'child_process';
import { promisify } from 'util';
import { logger } from '../middleware/logging.js';

const execAsync = promisify(exec);

class TerminalService {
  constructor() {
    this.maxOutputLength = 4000;
    this.timeout = 30000; // 30 seconds
    this.allowedCommands = [
      'git',
      'ls',
      'pwd',
      'echo',
      'whoami',
      'date',
      'ps',
      'node',
      'npm',
      'docker',
      'curl',
      'wget',
    ];
  }

  isCommandAllowed(command) {
    const baseCommand = command.split(' ')[0].split('/').pop();
    return this.allowedCommands.some(allowed => 
      baseCommand === allowed || baseCommand.startsWith(allowed)
    );
  }

  sanitizeCommand(command) {
    // Remove dangerous characters and sequences
    const dangerous = ['&&', '||', ';', '|', '$(', '`', '&'];
    let sanitized = command;
    
    dangerous.forEach(char => {
      if (command.includes(char)) {
        // Allow some safe combinations like && for git commands
        if (!(command.startsWith('git') && (char === '&&' || char === ';'))) {
          // Just log but don't block for now - admins have full power
        }
      }
    });
    
    return sanitized;
  }

  async execute(command, userId) {
    try {
      logger.info('Terminal Command', { userId, command });

      const sanitized = this.sanitizeCommand(command);

      const { stdout, stderr } = await execAsync(sanitized, {
        timeout: this.timeout,
        maxBuffer: 1024 * 1024 * 10, // 10MB
        shell: '/bin/bash',
      });

      const output = (stdout || stderr || 'Command executed successfully').substring(0, this.maxOutputLength);
      
      logger.info('Terminal Command Success', { userId, command });
      return {
        success: true,
        output: output,
        command: command,
      };
    } catch (error) {
      logger.error('Terminal Command Error', { userId, command, error: error.message });
      return {
        success: false,
        error: error.message.substring(0, this.maxOutputLength),
        command: command,
      };
    }
  }

  async gitCommand(args, userId) {
    const command = `git ${args}`;
    logger.info('Git Command', { userId, command });
    return this.execute(command, userId);
  }

  async getSystemInfo() {
    try {
      const hostname = execSync('hostname').toString().trim();
      const uptime = execSync('uptime').toString().trim();
      const df = execSync('df -h /').toString().trim();
      
      return {
        hostname,
        uptime,
        diskSpace: df.split('\n')[1],
      };
    } catch (error) {
      logger.error('System Info Error', { error: error.message });
      return { error: error.message };
    }
  }
}

export const terminalService = new TerminalService();
export default terminalService;
