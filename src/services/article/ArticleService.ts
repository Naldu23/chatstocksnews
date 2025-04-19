
import { WebhookResponse } from '../base/BaseWebhookService';

export class ArticleService {
  // Using a different n8n webhook URL from the ones already being used in the application
  private static WEBHOOK_URL = 'https://n8n.bioking.kr/webhook/e17e4c67-018a-4265-8bc7-ba8a32059b3b';

  public static async fetchArticleContent(type: 'us' | 'kor', articleId: string): Promise<WebhookResponse> {
    try {
      console.log(`Sending GET request to webhook for ${type} article: ${articleId}`);
      
      // URL encode the articleId to handle special characters
      const encodedArticleId = encodeURIComponent(articleId);
      
      // Construct the query string for the GET request
      const queryParams = new URLSearchParams({
        type,
        articleId: encodedArticleId,
        timestamp: new Date().toISOString()
      });
      
      // Append query parameters to the URL
      const url = `${this.WEBHOOK_URL}?${queryParams.toString()}`;
      console.log(`Full webhook URL: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Received webhook response:`, data);
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching article content:', error);
      return { success: false, error: String(error) };
    }
  }
}
