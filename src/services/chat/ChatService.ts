
import { BaseWebhookService } from '../base/BaseWebhookService';

export class ChatService extends BaseWebhookService {
  private static readonly CHAT_WEBHOOK_URL = 'https://n8n.bioking.kr/webhook/661d3919-a57f-4c5a-8491-359120f8165b';
  private static readonly RESEARCH_WEBHOOK_URL = 'https://n8n.bioking.kr/webhook-test/research';
  private static readonly REPORT_WEBHOOK_URL = 'https://n8n.bioking.kr/webhook-test/report';
  private static instance: ChatService;

  private constructor() {
    super();
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  public async sendChatMessage(message: string, sessionId: string) {
    return this.sendWebhookRequest(
      ChatService.CHAT_WEBHOOK_URL,
      { message, sessionId, timestamp: new Date().toISOString() },
      'POST'
    );
  }

  public async sendResearchRequest(query: string, sessionId: string) {
    return this.sendWebhookRequest(
      ChatService.RESEARCH_WEBHOOK_URL,
      { query, sessionId, timestamp: new Date().toISOString() },
      'POST'
    );
  }

  public async sendReportRequest(topic: string, sessionId: string) {
    return this.sendWebhookRequest(
      ChatService.REPORT_WEBHOOK_URL,
      { topic, sessionId, timestamp: new Date().toISOString() },
      'POST'
    );
  }
}

export const chatService = ChatService.getInstance();
