
import { BaseWebhookService } from '../base/BaseWebhookService';
import { format } from 'date-fns';

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
    // Fixed timezone issue: 
    // 1. If date is defined, format it to YYYY-MM-DD to avoid timezone shifts
    // 2. Send the formatted date string instead of the ISO string
    let formattedDate = null;
    
    if (date) {
      // Format the date as YYYY-MM-DD to avoid time zone issues
      formattedDate = format(date, 'yyyy-MM-dd');
      console.log(`Original date: ${date.toISOString()}, Formatted date: ${formattedDate}`);
    }
    
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
