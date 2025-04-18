
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
}

export default N8nService;
