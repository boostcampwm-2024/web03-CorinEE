import { Logger } from '@nestjs/common';
import * as WebSocket from 'ws';

export abstract class BaseWebSocketService {
  private websocket: WebSocket;
  private sending: boolean = false;
  protected readonly logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context); // 동적으로 context 설정
  }

  protected abstract handleMessage(data: any): void;

  protected connectWebSocket(
    websocketUrl: string,
    reconnectInterval: number,
  ): void {
    this.websocket = new WebSocket(websocketUrl);

    this.websocket.on('open', () => {
      this.logger.log('WebSocket 연결이 열렸습니다.');
      this.sendWebSocket();
    });

    this.websocket.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        this.handleMessage(message);
      } catch (error) {
        this.logger.error('WebSocket 메시지 처리 중 오류:', error);
      }
    });

    this.websocket.on('close', () => {
      this.logger.warn('WebSocket 연결이 닫혔습니다. 재연결 시도 중...');
      setTimeout(
        () => this.connectWebSocket(websocketUrl, reconnectInterval),
        reconnectInterval,
      );
    });

    this.websocket.on('error', (error) => {
      this.logger.error('WebSocket 오류:', error);
    });
  }

  protected async sendWebSocket(): Promise<void> {
    if (this.sending) return;
    this.sending = true;

    try {
      if (this.websocket.readyState !== WebSocket.OPEN) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      const message = this.getSubscribeMessage();
      this.websocket.send(message);
    } catch (error) {
      this.logger.error('WebSocket 메시지 전송 중 오류:', error);
    } finally {
      this.sending = false;
    }
  }

  protected abstract getSubscribeMessage(): string;
}
