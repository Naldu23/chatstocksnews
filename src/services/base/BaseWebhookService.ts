
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
        // Add timeout to prevent long-hanging requests
        signal: AbortSignal.timeout(10000), // 10 second timeout
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
      
      // Add retry logic for network issues
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          attempts++;
          const response = await fetch(finalUrl, options);
          const data = await response.json();
          
          console.log(`Webhook response from ${url}:`, data);
          
          return {
            success: response.ok,
            data
          };
        } catch (fetchError) {
          if (attempts >= maxAttempts) {
            throw fetchError; // Re-throw if we've reached max attempts
          }
          
          console.warn(`Attempt ${attempts} failed, retrying...`, fetchError);
          // Wait before retrying (exponential backoff)
          await new Promise(r => setTimeout(r, 1000 * attempts));
        }
      }
      
      // This should never be reached due to the throw in the catch block above
      throw new Error('All retry attempts failed');
    } catch (error) {
      console.error(`Error in webhook request to ${url}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}
