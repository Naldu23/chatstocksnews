
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
      console.log(`Sending webhook request to ${url} with method ${method}:`, payload);
      
      let finalUrl = url;
      let options: RequestInit = {
        method,
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(15000), // 15 second timeout
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store', // Prevent caching of requests
      };
      
      // Log the importance level if it exists in the payload
      if (payload && payload.importance) {
        console.log(`Request importance level: ${payload.importance}`);
      }
      
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
        console.log(`Final GET URL: ${finalUrl}`);
      } else if (method === 'POST') {
        options.headers = {
          ...options.headers,
          'Content-Type': 'application/json',
        };
        options.body = JSON.stringify(payload);
      }
      
      // Add retry logic based on importance level
      let attempts = 0;
      // Determine max attempts based on importance (higher importance = more retries)
      const getMaxAttempts = (importance: number = 3) => {
        switch(importance) {
          case 1: return 5; // Critical - 5 retries
          case 2: return 4; // Important - 4 retries
          case 3: return 3; // Standard - 3 retries
          case 4: return 2; // Low - 2 retries
          default: return 3; // Default - 3 retries
        }
      };
      
      const maxAttempts = getMaxAttempts(payload?.importance);
      console.log(`Setting max retry attempts to ${maxAttempts} based on importance level ${payload?.importance || 'default'}`);
      
      while (attempts < maxAttempts) {
        try {
          attempts++;
          console.log(`Attempt ${attempts} to fetch from ${finalUrl} with method ${method}`);
          const response = await fetch(finalUrl, options);
          
          // Check for successful response
          if (!response.ok) {
            console.error(`Server responded with status: ${response.status}`);
            const responseText = await response.text();
            console.error(`Response body: ${responseText}`);
            throw new Error(`Server responded with status: ${response.status} - ${responseText}`);
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
              console.log('Response is not JSON, keeping as text');
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
          // Wait before retrying (exponential backoff adjusted by importance)
          const backoffFactor = payload?.importance ? (5 - payload.importance) : 1; // Adjust backoff based on importance
          const delayMs = 1000 * Math.pow(1.5, attempts - 1) * backoffFactor;
          console.log(`Waiting ${delayMs}ms before retry (importance factor: ${backoffFactor})`);
          await new Promise(r => setTimeout(r, delayMs));
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
