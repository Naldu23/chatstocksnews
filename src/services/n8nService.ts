
import { dateFilterService } from './dateFilter/DateFilterService';
import { stockService } from './stock/StockService';
import { chatService } from './chat/ChatService';

export class N8nService {
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

  // Add new method for featured articles webhook
  public static async fetchFeaturedArticles() {
    try {
      const timestamp = new Date().getTime();
      const userAgent = navigator.userAgent;
      
      // Changed to new webhook URL
      const response = await fetch(`https://n8n.bioking.kr/webhook/d2c35989-6df5-4f99-8134-230e423f90f3?message=Featured+Articles&timestamp=${timestamp}&userAgent=${encodeURIComponent(userAgent)}`, {
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
      
      // Handle the case where the response only contains a workflow started message
      if (responseData && responseData.message === "Workflow was started") {
        // Make a second request after a short delay to get the actual data
        await new Promise(resolve => setTimeout(resolve, 1000));
        const secondResponse = await fetch(`https://n8n.bioking.kr/webhook/d2c35989-6df5-4f99-8134-230e423f90f3?message=Featured+Articles+Results&timestamp=${timestamp + 1000}&userAgent=${encodeURIComponent(userAgent)}`, {
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
