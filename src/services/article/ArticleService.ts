
import { WebhookResponse } from '../base/BaseWebhookService';

export class ArticleService {
  private static WEBHOOK_URL = 'https://n8n.bioking.kr/webhook-test/e17e4c67-018a-4265-8bc7-ba8a32059b3b';

  public static async fetchArticleContent(type: 'us' | 'kor', articleId: string): Promise<WebhookResponse> {
    try {
      const response = await fetch(this.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          articleId,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching article content:', error);
      return { success: false, error: String(error) };
    }
  }
}
