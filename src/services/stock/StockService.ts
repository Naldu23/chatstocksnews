
import { BaseWebhookService } from '../base/BaseWebhookService';
import { WebhookImportance } from '../chat/ChatService';

export class StockService extends BaseWebhookService {
  private static readonly STOCK_DATA_WEBHOOK_URL = 'https://n8n.bioking.kr/webhook-test/stocks-data';
  private static readonly TRENDING_STOCKS_WEBHOOK_URL = 'https://n8n.bioking.kr/webhook-test/trending-stocks';
  private static readonly STOCKS_VISIT_WEBHOOK_URL = 'https://n8n.bioking.kr/webhook-test/stocks-visit';
  private static instance: StockService;

  private constructor() {
    super();
  }

  public static getInstance(): StockService {
    if (!StockService.instance) {
      StockService.instance = new StockService();
    }
    return StockService.instance;
  }

  public async fetchStockData(symbol: string, timeframe: string) {
    return this.sendWebhookRequest(
      StockService.STOCK_DATA_WEBHOOK_URL,
      { 
        symbol, 
        timeframe, 
        timestamp: new Date().toISOString(),
        importance: WebhookImportance.IMPORTANT // Setting stock data as IMPORTANT (2)
      }
    );
  }

  public async fetchTrendingStocks() {
    return this.sendWebhookRequest(
      StockService.TRENDING_STOCKS_WEBHOOK_URL,
      { 
        timestamp: new Date().toISOString(),
        importance: WebhookImportance.STANDARD // Setting trending stocks as STANDARD (3)
      }
    );
  }

  public async sendStocksOverviewVisit(userAgent: string) {
    return this.sendWebhookRequest(
      StockService.STOCKS_VISIT_WEBHOOK_URL,
      { 
        userAgent, 
        timestamp: new Date().toISOString(),
        importance: WebhookImportance.LOW // Setting visit tracking as LOW (4)
      }
    );
  }
}

export const stockService = StockService.getInstance();
