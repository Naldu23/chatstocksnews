
interface WebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export type WebhookType = 'chat' | 'research' | 'report' | 'stocks' | 'news' | 'stocksOverview';

const N8N_BASE_URL = 'https://naldu.app.n8n.cloud';

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
      research: 'webhook/a74ca145-c884-4c43-8794-7b70ed9e34fb', // Use same endpoint for now
      report: 'webhook/a74ca145-c884-4c43-8794-7b70ed9e34fb', // Use same endpoint for now
      stocks: 'webhook-test/2', 
      news: 'webhook-test/3',
      stocksOverview: 'webhook-test/e7811fb4-17f2-4660-9f96-be1cbbebe029'
    };
    
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
      
      // For GET requests, convert payload to query parameters
      if (method === 'GET' && payload) {
        const queryParams = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
          queryParams.append(key, String(value));
        });
        url = `${url}?${queryParams.toString()}`;
      } else {
        // For POST requests, add the payload to the body
        options.body = JSON.stringify(payload);
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
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  // --- Public API ---
  
  /**
   * Sends a chat message to the n8n webhook
   */
  public static async sendChatMessage(message: string, sessionId: string): Promise<WebhookResponse> {
    // Ensure sessionId is not empty
    const safeSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return N8nService.getInstance().sendWebhookRequest('chat', { message, sessionId: safeSessionId, type: 'chat' }, 'GET');
  }
  
  /**
   * Sends a research request to the n8n webhook
   */
  public static async sendResearchRequest(message: string, sessionId: string): Promise<WebhookResponse> {
    const safeSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return N8nService.getInstance().sendWebhookRequest('research', { message, sessionId: safeSessionId, type: 'research' }, 'GET');
  }
  
  /**
   * Sends a report request to the n8n webhook
   */
  public static async sendReportRequest(message: string, sessionId: string): Promise<WebhookResponse> {
    const safeSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return N8nService.getInstance().sendWebhookRequest('report', { message, sessionId: safeSessionId, type: 'report' }, 'GET');
  }
  
  /**
   * Fetches stock data via the n8n webhook
   */
  public static async fetchStockData(symbol: string, timeframe: string): Promise<WebhookResponse> {
    return N8nService.getInstance().sendWebhookRequest('stocks', { symbol, timeframe });
  }
  
  /**
   * Fetches news data via the n8n webhook
   */
  public static async fetchNewsData(category: string, count: number): Promise<WebhookResponse> {
    return N8nService.getInstance().sendWebhookRequest('news', { category, count });
  }
  
  /**
   * Sends stock overview page visit information to the n8n webhook
   */
  public static async sendStocksOverviewVisit(userAgent: string): Promise<WebhookResponse> {
    // Use GET method instead of POST (default)
    return N8nService.getInstance().sendWebhookRequest('stocksOverview', { 
      timestamp: new Date().toISOString(),
      page: 'stocks-overview',
      userAgent
    }, 'GET');
  }
}

export default N8nService;
