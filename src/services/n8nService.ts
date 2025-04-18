
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
}

export default N8nService;
