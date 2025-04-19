
import { BaseWebhookService } from '../base/BaseWebhookService';

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
      { symbol, timeframe, timestamp: new Date().toISOString() }
    );
  }

  public async fetchTrendingStocks() {
    return this.sendWebhookRequest(
      StockService.TRENDING_STOCKS_WEBHOOK_URL,
      { timestamp: new Date().toISOString() }
    );
  }

  public async sendStocksOverviewVisit(userAgent: string) {
    return this.sendWebhookRequest(
      StockService.STOCKS_VISIT_WEBHOOK_URL,
      { userAgent, timestamp: new Date().toISOString() }
    );
  }
}

export const stockService = StockService.getInstance();
