import axios from 'axios';
import { config } from '../config.js';
import { logger } from '../middleware/logging.js';

class SerperService {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://google.serper.dev',
      headers: {
        'X-API-KEY': config.serper.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  async search(query, options = {}) {
    try {
      logger.info('Serper Search', { query });

      const response = await this.client.post('/search', {
        q: query,
        num: options.num || 10,
        gl: options.gl || 'us',
        hl: options.hl || 'en',
      });

      const results = this.parseResults(response.data);
      logger.info('Serper Search Success', { resultCount: results.length });
      return results;
    } catch (error) {
      logger.error('Serper Search Error', { error: error.message });
      throw new Error(`Search Error: ${error.message}`);
    }
  }

  async news(query, options = {}) {
    try {
      logger.info('Serper News Search', { query });

      const response = await this.client.post('/news', {
        q: query,
        num: options.num || 10,
      });

      const results = this.parseNewsResults(response.data);
      logger.info('Serper News Search Success');
      return results;
    } catch (error) {
      logger.error('Serper News Search Error', { error: error.message });
      throw new Error(`News Search Error: ${error.message}`);
    }
  }

  parseResults(data) {
    const results = [];

    if (data.organic) {
      results.push(...data.organic.map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        position: item.position,
      })));
    }

    return results.slice(0, 10);
  }

  parseNewsResults(data) {
    const results = [];

    if (data.news) {
      results.push(...data.news.map(item => ({
        title: item.title,
        link: item.link,
        source: item.source,
        date: item.date,
      })));
    }

    return results.slice(0, 10);
  }

  async formatSearchResults(results) {
    let formatted = '🔍 *Search Results:*\n\n';
    results.forEach((result, index) => {
      formatted += `${index + 1}. *${result.title}*\n`;
      formatted += `   Link: ${result.link}\n`;
      formatted += `   ${result.snippet}\n\n`;
    });
    return formatted;
  }
}

export const serperService = new SerperService();
export default serperService;
