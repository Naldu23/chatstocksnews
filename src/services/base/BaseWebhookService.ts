
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
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(15000), // 15 second timeout
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store', // Prevent caching of requests
      };
      
      if (method === 'GET' && payload) {
        const queryParams = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            queryParams.append(key, String(value));
          }
        });
        
        // Add a cache-busting parameter to prevent browser caching
        queryParams.append('_t', Date.now().toString());
        
        finalUrl = `${url}?${queryParams.toString()}`;
      } else if (method === 'POST') {
        options.body = JSON.stringify(payload);
        
        // Try using 'no-cors' mode for POST requests to handle CORS issues
        // Note: This will make the response opaque, but at least the request will go through
        options.mode = 'no-cors';
      }
      
      // Add retry logic for network issues
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          attempts++;
          console.log(`Attempt ${attempts} to fetch from ${finalUrl}`);
          const response = await fetch(finalUrl, options);
          
          // When using no-cors mode, we can't actually check response.ok
          // So we'll just assume it succeeded if we get here
          if (options.mode === 'no-cors') {
            console.log('Request sent in no-cors mode, assuming success');
            return {
              success: true,
              data: { message: "Request sent successfully" }
            };
          }
          
          // Check for successful response
          if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
          }
          
          // Try to parse the response as JSON
          let data;
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            data = await response.json();
          } else {
            data = await response.text();
            try {
              // Try to parse text as JSON if possible
              data = JSON.parse(data);
            } catch (e) {
              // Keep as text if not valid JSON
            }
          }
          
          console.log(`Webhook response from ${url}:`, data);
          
          return {
            success: response.ok,
            data
          };
        } catch (fetchError) {
          console.error(`Fetch attempt ${attempts} failed:`, fetchError);
          
          if (attempts >= maxAttempts) {
            throw fetchError; // Re-throw if we've reached max attempts
          }
          
          console.warn(`Attempt ${attempts} failed, retrying...`, fetchError);
          // Wait before retrying (exponential backoff)
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempts - 1)));
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
