import { WebhookResponse, WebhookType } from './types';

interface WebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export type WebhookType = 'chat' | 'research' | 'report' | 'stocks' | 'news' | 'stocksOverview' | 'trendingStocks' | 'dateFilter';

const N8N_BASE_URL = 'https://n8n.bioking.kr';
const N8N_DATE_WEBHOOK_URL = 'https://n8n.bioking.kr/webhook-test/7404c6fa-5c6f-49d6-9746-c25c5fc53411';

/**
 * Service for handling n8n webhook integrations
 */
export class N8nService {
  private static getInstance(): N8nService {
    if (!N8nService.instance) {
      N8nService.instance = new N8nService();
    }
    return N8nService.instance;
  }
  
  private static instance: N8nService;
  
  private constructor() {}
  
  /**
   * Gets the appropriate webhook URL for the given type
   */
  private getWebhookUrl(type: WebhookType): string {
    const endpoints = {
      chat: 'webhook/a74ca145-c884-4c43-8794-7b70ed9e34fb',
      research: 'webhook/a74ca145-c884-4c43-8794-7b70ed9e34fb',
      report: 'webhook/a74ca145-c884-4c43-8794-7b70ed9e34fb',
      stocks: 'webhook-test/2', 
      news: 'webhook-test/3',
      stocksOverview: 'webhook-test/e7811fb4-17f2-4660-9f96-be1cbbebe029',
      trendingStocks: 'webhook-test/trending-stocks',
      dateFilter: 'webhook-test/7404c6fa-5c6f-49d6-9746-c25c5fc53411'
    };
    
    if (type === 'dateFilter') {
      return N8N_DATE_WEBHOOK_URL;
    }
    
    return `${N8N_BASE_URL}/${endpoints[type]}`;
  }
  
  /**
   * Sends a request to the n8n webhook
   */
  private async sendWebhookRequest(
    type: WebhookType,
    payload: any,
    method: 'GET' | 'POST' = 'POST'
  ): Promise<WebhookResponse> {
    try {
      console.log(`Sending ${type} webhook request:`, payload);
      
      let url = this.getWebhookUrl(type);
      let options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (method === 'GET' && payload) {
        const queryParams = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });
        url = `${url}?${queryParams.toString()}`;
      } else {
        options.body = JSON.stringify(payload);
      }
      
      if (type === 'trendingStocks') {
        console.log('Returning mock data for trending stocks');
        return this.getMockTrendingStocksResponse();
      }
      
      const response = await fetch(url, options);
      
      const data = await response.json();
      console.log(`${type} webhook response:`, data);
      
      return {
        success: response.ok,
        data
      };
    } catch (error) {
      console.error(`Error in ${type} webhook:`, error);
      
      if (type === 'trendingStocks') {
        console.log('Returning mock data for trending stocks due to error');
        return this.getMockTrendingStocksResponse();
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  private getMockTrendingStocksResponse(): WebhookResponse {
    return {
      success: true,
      data: {
        stocks: [
          {
            symbol: 'LLY',
            name: 'Eli Lilly and Company',
            price: 782.06,
            percentChange: 0.67,
            volume: 3212400
          },
          {
            symbol: 'NVO',
            name: 'Novo Nordisk A/S',
            price: 129.27,
            percentChange: 1.71,
            volume: 3985700
          },
          {
            symbol: 'ABBV',
            name: 'AbbVie Inc.',
            price: 162.38,
            percentChange: 0.85,
            volume: 5412300
          },
          {
            symbol: 'MRK',
            name: 'Merck & Company Inc.',
            price: 129.45,
            percentChange: 1.43,
            volume: 8921400
          },
          {
            symbol: 'AMGN',
            name: 'Amgen Inc.',
            price: 271.54,
            percentChange: -0.44,
            volume: 2421500
          },
          {
            symbol: 'PFE',
            name: 'Pfizer Inc.',
            price: 27.67,
            percentChange: 0.91,
            volume: 38421500
          }
        ]
      }
    };
  }
  
  public static async sendChatMessage(message: string, sessionId: string): Promise<WebhookResponse> {
    const safeSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return N8nService.getInstance().sendWebhookRequest('chat', { message, sessionId: safeSessionId, type: 'chat' }, 'GET');
  }
  
  public static async sendResearchRequest(message: string, sessionId: string): Promise<WebhookResponse> {
    const safeSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return N8nService.getInstance().sendWebhookRequest('research', { message, sessionId: safeSessionId, type: 'research' }, 'GET');
  }
  
  public static async sendReportRequest(message: string, sessionId: string): Promise<WebhookResponse> {
    const safeSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return N8nService.getInstance().sendWebhookRequest('report', { message, sessionId: safeSessionId, type: 'report' }, 'GET');
  }
  
  public static async fetchStockData(symbol: string, timeframe: string): Promise<WebhookResponse> {
    return N8nService.getInstance().sendWebhookRequest('stocks', { symbol, timeframe });
  }
  
  public static async fetchNewsData(category: string, count: number): Promise<WebhookResponse> {
    return N8nService.getInstance().sendWebhookRequest('news', { category, count });
  }
  
  public static async sendStocksOverviewVisit(userAgent: string): Promise<WebhookResponse> {
    return N8nService.getInstance().sendWebhookRequest('stocksOverview', { 
      timestamp: new Date().toISOString(),
      page: 'stocks-overview',
      userAgent
    }, 'GET');
  }
  
  public static async fetchTrendingStocks(): Promise<WebhookResponse> {
    return N8nService.getInstance().sendWebhookRequest('trendingStocks', {});
  }
  
  public static async sendDateFilter(date: Date | undefined): Promise<WebhookResponse> {
    const formattedDate = date ? date.toISOString() : null;
    return N8nService.getInstance().sendWebhookRequest('dateFilter', { 
      date: formattedDate,
      timestamp: new Date().toISOString()
    }, 'POST');
  }
}

export default N8nService;
