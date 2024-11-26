export class TradeNotFoundException extends Error {
    constructor(tradeId: number) {
      super(`Trade ID ${tradeId}를 찾을 수 없습니다.`);
    }
  }
  
  export class TradeCreateFailedException extends Error {
    constructor(userId: number, message?: string) {
      super(`유저 ${userId}의 미체결 생성 실패: ${message || ''}`);
    }
  }
  
  export class TradeUpdateFailedException extends Error {
    constructor(tradeId: number, message?: string) {
      super(`Trade ID ${tradeId} 수량 업데이트 실패: ${message || ''}`);
    }
  }
  
  export class TradeLockFailedException extends Error {
    constructor(tradeId: number) {
      super(`Trade ID ${tradeId}에 대한 락 획득 실패`);
    }
  }
  
  export class TradeDeleteFailedException extends Error {
    constructor(tradeId: number, message?: string) {
      super(`Trade ID ${tradeId} 삭제 실패: ${message || ''}`);
    }
  }