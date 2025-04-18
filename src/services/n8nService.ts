
import { dateFilterService } from './dateFilter/DateFilterService';

export class N8nService {
  public static async sendDateFilter(date: Date | undefined) {
    return dateFilterService.sendDateFilter(date);
  }
}

export default N8nService;
