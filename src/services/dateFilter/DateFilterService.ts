
import { BaseWebhookService } from '../base/BaseWebhookService';

export class DateFilterService extends BaseWebhookService {
  private static readonly DATE_WEBHOOK_URL = 'https://n8n.bioking.kr/webhook/7404c6fa-5c6f-49d6-9746-c25c5fc53411';
  private static instance: DateFilterService;

  private constructor() {
    super();
  }

  public static getInstance(): DateFilterService {
    if (!DateFilterService.instance) {
      DateFilterService.instance = new DateFilterService();
    }
    return DateFilterService.instance;
  }

  public async sendDateFilter(date: Date | undefined) {
    const formattedDate = date ? date.toISOString() : null;
    return this.sendWebhookRequest(
      DateFilterService.DATE_WEBHOOK_URL, 
      { 
        date: formattedDate,
        timestamp: new Date().toISOString()
      }
    );
  }
}

export const dateFilterService = DateFilterService.getInstance();
