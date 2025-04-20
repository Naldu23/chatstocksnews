import { BaseWebhookService } from '../base/BaseWebhookService';

export class ChatService extends BaseWebhookService {
  private static readonly CHAT_WEBHOOK_URL = 'https://n8n.bioking.kr/webhook/661d3919-a57f-4c5a-8491-359120f8165b';
  private static readonly CHAT_FALLBACK_URL = 'https://n8n.bioking.kr/webhook/chat-fallback';
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
    try {
      const result = await this.sendWebhookRequest(
        ChatService.CHAT_WEBHOOK_URL,
        { message, sessionId, timestamp: new Date().toISOString() },
        'GET'
      );
      
      // If the primary webhook fails, use the fallback response
      if (!result.success) {
        console.warn('Primary chat webhook failed, simulating response');
        return this.generateSimulatedResponse(message);
      }
      
      return result;
    } catch (error) {
      console.error('Error in chat service:', error);
      return this.generateSimulatedResponse(message);
    }
  }

  public async sendResearchRequest(query: string, sessionId: string) {
    try {
      const result = await this.sendWebhookRequest(
        ChatService.RESEARCH_WEBHOOK_URL,
        { query, sessionId, timestamp: new Date().toISOString() },
        'POST'
      );
      
      if (!result.success) {
        console.warn('Research webhook failed, simulating response');
        return this.generateSimulatedResearchResponse(query);
      }
      
      return result;
    } catch (error) {
      console.error('Error in research service:', error);
      return this.generateSimulatedResearchResponse(query);
    }
  }

  public async sendReportRequest(topic: string, sessionId: string) {
    try {
      const result = await this.sendWebhookRequest(
        ChatService.REPORT_WEBHOOK_URL,
        { topic, sessionId, timestamp: new Date().toISOString() },
        'POST'
      );
      
      if (!result.success) {
        console.warn('Report webhook failed, simulating response');
        return this.generateSimulatedReportResponse(topic);
      }
      
      return result;
    } catch (error) {
      console.error('Error in report service:', error);
      return this.generateSimulatedReportResponse(topic);
    }
  }
  
  private generateSimulatedResponse(message: string) {
    // Generate a simulated response when the webhook fails
    const responses = [
      "I understand you're asking about '{{message}}'. While I'm currently operating in offline mode due to connection issues, I can still help with general information.",
      "Thanks for your message. I'm currently running in a fallback mode due to connection issues, but I can still assist you with '{{message}}'.",
      "I received your query about '{{message}}'. I'm operating in offline mode at the moment, but I'm still here to help.",
      "I see you're interested in '{{message}}'. While I have limited connectivity right now, I can still provide some assistance."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      .replace('{{message}}', message);
    
    return {
      success: true,
      data: {
        message: {
          role: "assistant",
          content: randomResponse
        }
      }
    };
  }
  
  private generateSimulatedResearchResponse(query: string) {
    return {
      success: true,
      data: {
        message: {
          role: "assistant",
          content: `I received your research request about "${query}". I'm currently unable to perform deep research due to connection issues with the research service. However, I can still help answer general questions about this topic based on my existing knowledge. Please feel free to ask, or try again later when the service might be back online.`
        }
      }
    };
  }
  
  private generateSimulatedReportResponse(topic: string) {
    return {
      success: true,
      data: {
        message: {
          role: "assistant",
          content: `I received your request to create a report on "${topic}". Unfortunately, I'm currently unable to generate a full report due to connection issues with the reporting service. I'd be happy to discuss this topic generally or you can try again later when the service might be back online.`
        }
      }
    };
  }
}

export const chatService = ChatService.getInstance();
