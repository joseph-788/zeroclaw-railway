import axios from 'axios';
import { config } from '../config.js';
import { logger } from '../middleware/logging.js';

class NvidiaClient {
  constructor() {
    this.client = axios.create({
      baseURL: config.nvidia.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.nvidia.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    this.currentModel = config.nvidia.defaultModel;
  }

  setModel(modelId) {
    if (config.models[modelId]) {
      this.currentModel = config.models[modelId].modelId;
      logger.info(`Model switched to: ${modelId}`);
      return true;
    }
    return false;
  }

  getAvailableModels() {
    return Object.entries(config.models).map(([key, model]) => ({
      id: key,
      ...model,
    }));
  }

  getCurrentModel() {
    return this.currentModel;
  }

  async chat(prompt, systemMessage = '') {
    try {
      logger.info('NIM API Request', { model: this.currentModel, prompt: prompt.substring(0, 100) });

      const messages = [];
      
      if (systemMessage) {
        messages.push({ role: 'system', content: systemMessage });
      }
      
      messages.push({ role: 'user', content: prompt });

      const response = await this.client.post('/chat/completions', {
        model: this.currentModel,
        messages: messages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 2048,
      });

      const result = response.data.choices[0].message.content;
      logger.info('NIM API Success');
      return result;
    } catch (error) {
      logger.error('NIM API Error', { error: error.message });
      throw new Error(`NIM API Error: ${error.message}`);
    }
  }

  async codeCompletion(code, language = 'javascript') {
    const systemMessage = `You are an expert ${language} programmer. Complete the provided code snippet.`;
    return this.chat(code, systemMessage);
  }

  async summarize(text) {
    const prompt = `Please provide a concise summary of the following text:\n\n${text}`;
    return this.chat(prompt);
  }

  async translate(text, targetLanguage) {
    const prompt = `Translate the following text to ${targetLanguage}:\n\n${text}`;
    return this.chat(prompt);
  }
}

export const nvidiaClient = new NvidiaClient();
export default nvidiaClient;
