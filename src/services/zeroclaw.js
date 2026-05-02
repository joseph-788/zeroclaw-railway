import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../middleware/logging.js';

const execAsync = promisify(exec);

class ZeroClawService {
  constructor() {
    this.version = '1.0.0';
    this.installed = false;
    this.checkInstallation();
  }

  async checkInstallation() {
    try {
      await execAsync('zeroclaw --version', { timeout: 5000 });
      this.installed = true;
      logger.info('ZeroClaw is installed');
    } catch (error) {
      this.installed = false;
      logger.warn('ZeroClaw not found - installing...');
      await this.install();
    }
  }

  async install() {
    try {
      logger.info('Installing ZeroClaw from zeroclaw.org...');
      // Installation would be done via npm or pip depending on language
      // For now, log the intention
      logger.info('ZeroClaw installation initiated');
      return true;
    } catch (error) {
      logger.error('ZeroClaw Installation Error', { error: error.message });
      return false;
    }
  }

  async execute(prompt, options = {}) {
    try {
      if (!this.installed) {
        await this.checkInstallation();
      }

      logger.info('ZeroClaw Execute', { prompt: prompt.substring(0, 100) });

      // ZeroClaw command execution would happen here
      // This is a placeholder for the actual CLI command
      const command = `zeroclaw "${prompt.replace(/"/g, '\\"')}"`;
      
      const { stdout, stderr } = await execAsync(command, {
        timeout: 60000,
        maxBuffer: 1024 * 1024 * 10,
      });

      const result = stdout || stderr;
      logger.info('ZeroClaw Execute Success');
      
      return {
        success: true,
        result: result.substring(0, 4000),
      };
    } catch (error) {
      logger.error('ZeroClaw Execute Error', { error: error.message });
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async useTools(command) {
    try {
      logger.info('ZeroClaw Tool Use', { command });
      
      // ZeroClaw with full tool access
      const cmd = `zeroclaw --use-tools "${command.replace(/"/g, '\\"')}"`;
      
      const { stdout, stderr } = await execAsync(cmd, {
        timeout: 60000,
        maxBuffer: 1024 * 1024 * 10,
      });

      return {
        success: true,
        output: (stdout || stderr).substring(0, 4000),
      };
    } catch (error) {
      logger.error('ZeroClaw Tool Use Error', { error: error.message });
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getStatus() {
    return {
      installed: this.installed,
      version: this.version,
      ready: this.installed,
    };
  }

  async executeWithContext(prompt, context = {}) {
    try {
      logger.info('ZeroClaw Execute With Context', { prompt: prompt.substring(0, 100) });

      // Enhanced execution with context (tools, models, etc)
      const result = await this.execute(prompt, context);
      
      return result;
    } catch (error) {
      logger.error('ZeroClaw Context Execute Error', { error: error.message });
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export const zeroClawService = new ZeroClawService();
export default zeroClawService;
