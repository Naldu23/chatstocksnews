
import { BaseWebhookService } from '../base/BaseWebhookService';

export class ChatService extends BaseWebhookService {
  private static readonly CHAT_WEBHOOK_URL = 'https://n8n.bioking.kr/webhook/661d3919-a57f-4c5a-8491-359120f8165b';
  private static readonly RESEARCH_WEBHOOK_URL = 'https://n8n.bioking.kr/webhook/research';
  private static readonly REPORT_WEBHOOK_URL = 'https://n8n.bioking.kr/webhook/report';
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
    console.log(`Sending chat message to ${ChatService.CHAT_WEBHOOK_URL}`);
    return this.sendWebhookRequest(
      ChatService.CHAT_WEBHOOK_URL,
      { message, sessionId, timestamp: new Date().toISOString() },
      'POST'  // Explicitly set method to POST
    );
  }

  public async sendResearchRequest(query: string, sessionId: string) {
    console.log(`Sending research request to ${ChatService.RESEARCH_WEBHOOK_URL}`);
    return this.sendWebhookRequest(
      ChatService.RESEARCH_WEBHOOK_URL,
      { query, sessionId, timestamp: new Date().toISOString() },
      'POST'  // Explicitly set method to POST
    );
  }

  public async sendReportRequest(topic: string, sessionId: string) {
    console.log(`Sending report request to ${ChatService.REPORT_WEBHOOK_URL}`);
    return this.sendWebhookRequest(
      ChatService.REPORT_WEBHOOK_URL,
      { topic, sessionId, timestamp: new Date().toISOString() },
      'POST'  // Explicitly set method to POST
    );
  }
}

export const chatService = ChatService.getInstance();
