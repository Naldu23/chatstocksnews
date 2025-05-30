
import { dateFilterService } from './dateFilter/DateFilterService';
import { stockService } from './stock/StockService';
import { chatService } from './chat/ChatService';
import { BaseWebhookService } from './base/BaseWebhookService';

export class N8nService extends BaseWebhookService {
  // Helper function to convert importance string to number
  private static convertImportanceToNumber(importance: string | undefined): number {
    if (!importance) return 4; // default to lowest importance
    
    switch (importance.toLowerCase()) {
      case 'critical':
        return 1;
      case 'important':
        return 2;
      case 'useful':
        return 3;
      case 'interesting':
        return 4;
      default:
        return 4;
    }
  }

  // Helper function to convert importance number to string
  private static convertImportanceToString(importance: number): string {
    switch (importance) {
      case 1:
        return 'critical';
      case 2:
        return 'important';
      case 3:
        return 'useful';
      case 4:
        return 'interesting';
      default:
        return 'useful'; // default to 'useful' if an invalid number is provided
    }
  }

  // Update method to use GET request instead of POST
  public static async updateArticleGrade(articleType: 'us' | 'kor', articleId: string, grade: string) {
    try {
      const importance = this.convertImportanceToNumber(grade);
      console.log(`Updating article grade: type=${articleType}, id=${articleId}, grade=${grade}, importance=${importance}`);
      
      // Using the correct webhook URL as specified
      const webhookUrl = 'https://n8n.bioking.kr/webhook/d5ca48e8-d388-4e52-aecf-7778c9f6e7d3';
      
      // Create payload for GET parameters
      const payload = {
        type: articleType,
        importance: importance,
        articleId: articleId,
        timestamp: new Date().toISOString()
      };
      
      return await this.prototype.sendWebhookRequest(webhookUrl, payload, 'GET');
    } catch (error) {
      console.error('Error in updating article grade:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Date filter methods
  public static async sendDateFilter(date: Date | undefined) {
    return dateFilterService.sendDateFilter(date);
  }

  // Stock methods
  public static async fetchStockData(symbol: string, timeframe: string) {
    return stockService.fetchStockData(symbol, timeframe);
  }

  public static async fetchTrendingStocks() {
    return stockService.fetchTrendingStocks();
  }

  public static async sendStocksOverviewVisit(userAgent: string) {
    return stockService.sendStocksOverviewVisit(userAgent);
  }

  // Chat methods
  public static async sendChatMessage(message: string, sessionId: string) {
    return chatService.sendChatMessage(message, sessionId);
  }

  public static async sendResearchRequest(query: string, sessionId: string) {
    return chatService.sendResearchRequest(query, sessionId);
  }

  public static async sendReportRequest(topic: string, sessionId: string) {
    return chatService.sendReportRequest(topic, sessionId);
  }

  // Article methods
  public static async fetchArticleContent(articleId: string) {
    // For now, use a dummy implementation that returns the article's content based on the ID
    // In a real implementation, this would call a service method
    return {
      success: true,
      data: {
        content: `# Article Content for ${articleId}

This is a placeholder for the article content that would be fetched from the server.

## Subheading

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nisl nisl aliquet nisl, eget aliquam ultricies nisl nisl aliquet nisl.

* Bullet point 1
* Bullet point 2
* Bullet point 3

### Another Subheading

More content paragraphs would go here. This is just a sample of what the markdown content might look like when fetched from the server.`
      }
    };
  }

  // English News Methods
  public static async fetchEnglishFeaturedArticles() {
    return N8nService.fetchFeaturedArticles('https://n8n.bioking.kr/webhook/d2c35989-6df5-4f99-8134-230e423f90f3');
  }

  public static async fetchEnglishNews(date: Date | undefined) {
    try {
      const timestamp = new Date().getTime();
      const userAgent = navigator.userAgent;
      
      const webhookUrl = 'https://n8n.bioking.kr/webhook/a5c542d8-e799-4cc3-9b68-583c493ea544';
      
      let dateParam = '';
      if (date) {
        const formattedDate = date.toISOString().split('T')[0];
        dateParam = `&date=${formattedDate}`;
        console.log(`Fetching English news with date: ${formattedDate}`);
      }
      
      const response = await fetch(`${webhookUrl}?timestamp=${timestamp}${dateParam}&userAgent=${encodeURIComponent(userAgent)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      // Convert importance numbers to strings
      if (data.articles && Array.isArray(data.articles)) {
        data.articles = data.articles.map(article => ({
          ...article,
          grade: N8nService.convertImportanceToString(article.importance)
        }));
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching English news:', error);
      return { success: false, error: String(error) };
    }
  }

  // Korean News Methods
  public static async fetchKoreanFeaturedArticles() {
    return N8nService.fetchFeaturedArticles('https://n8n.bioking.kr/webhook/10e40f57-a02e-4aff-b8fa-1a0efae68cf9');
  }

  public static async fetchKoreanNews(date: Date | undefined) {
    try {
      const timestamp = new Date().getTime();
      const userAgent = navigator.userAgent;
      
      const webhookUrl = 'https://n8n.bioking.kr/webhook/9135400d-3e9e-4590-9530-bc0386e56c4b';
      
      let dateParam = '';
      if (date) {
        const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        normalizedDate.setDate(normalizedDate.getDate() + 1);
        const formattedDate = normalizedDate.toISOString().split('T')[0];
        dateParam = `&date=${formattedDate}`;
        console.log(`Fetching Korean news with selected date: ${date.toLocaleDateString()}, adjusted date: ${normalizedDate.toLocaleDateString()}, formatted: ${formattedDate}`);
      }
      
      const response = await fetch(`${webhookUrl}?timestamp=${timestamp}${dateParam}&userAgent=${encodeURIComponent(userAgent)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      
      // Convert importance numbers to strings
      if (data.articles && Array.isArray(data.articles)) {
        data.articles = data.articles.map(article => ({
          ...article,
          grade: N8nService.convertImportanceToString(article.importance)
        }));
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching Korean news:', error);
      return { success: false, error: String(error) };
    }
  }

  // Helper method for featured articles
  private static async fetchFeaturedArticles(webhookUrl: string) {
    try {
      const timestamp = new Date().getTime();
      const userAgent = navigator.userAgent;
      
      const response = await fetch(`${webhookUrl}?message=Featured+Articles&timestamp=${timestamp}&userAgent=${encodeURIComponent(userAgent)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Featured articles response:', responseData);
      
      if (responseData && responseData.message === "Workflow was started") {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const secondResponse = await fetch(`${webhookUrl}?message=Featured+Articles+Results&timestamp=${timestamp + 1000}&userAgent=${encodeURIComponent(userAgent)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!secondResponse.ok) {
          throw new Error(`HTTP error on second request! Status: ${secondResponse.status}`);
        }
        
        const secondData = await secondResponse.json();
        console.log('Second featured articles response:', secondData);
        return { success: true, data: secondData };
      }
      
      return { success: true, data: responseData };
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      return { success: false, error: String(error) };
    }
  }
}

export default N8nService;
