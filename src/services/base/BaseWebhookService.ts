
export interface WebhookResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export abstract class BaseWebhookService {
  protected static N8N_BASE_URL = 'https://n8n.bioking.kr';

  protected async sendWebhookRequest(
    url: string,
    payload: any,
    method: 'GET' | 'POST' = 'GET'
  ): Promise<WebhookResponse> {
    try {
      console.log(`Sending webhook request to ${url}:`, payload);
      
      let finalUrl = url;
      let options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (method === 'GET' && payload) {
        const queryParams = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
        finalUrl = `${url}?${queryParams.toString()}`;
      } else if (method === 'POST') {
        options.body = JSON.stringify(payload);
      }
      
      const response = await fetch(finalUrl, options);
      const data = await response.json();
      
      console.log(`Webhook response from ${url}:`, data);
      
      return {
        success: response.ok,
        data
      };
    } catch (error) {
      console.error(`Error in webhook request to ${url}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
