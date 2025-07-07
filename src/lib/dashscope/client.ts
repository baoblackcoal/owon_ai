import { DashScopeConfig } from './types';
import axios from 'axios';

const PIPELINE_IDS = ['he9rcpebc3', 'utmhvnxgey'];

export class DashScopeClient {
  private apiKey: string;
  private appId: string;

  constructor(config: DashScopeConfig) {
    this.apiKey = config.apiKey;
    this.appId = config.appId;
  }

  async sendMessage(prompt: string, sessionId?: string) {
    const url = `https://dashscope.aliyuncs.com/api/v1/apps/${this.appId}/completion`;

    const data = {
      input: {
        prompt,
        ...(sessionId && { session_id: sessionId })
      },
      parameters: {
        'incremental_output': 'true',
        'has_thoughts': 'true',
        rag_options: {
          pipeline_ids: PIPELINE_IDS
        }
      },
      debug: {}
    };

    const response = await axios.post(url, data, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-DashScope-SSE': 'enable'
      },
      responseType: 'stream'
    });

    return response;
  }
}

// Create a singleton instance
const dashscope = new DashScopeClient({
  apiKey: process.env.DASHSCOPE_API_KEY || '',
  appId: process.env.DASHSCOPE_APP_ID || ''
});

export default dashscope; 