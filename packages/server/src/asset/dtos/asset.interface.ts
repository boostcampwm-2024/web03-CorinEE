export interface Coin {
  code: string;
  avg_purchase_price: number; // 평균 매입가
  quantity: number; // 보유 수량
}

export interface CurrentPrice {
  code: string;
  trade_price: number; // 현재가
}

export interface Evaluation {
  code: string;
  avg_purchase_price: number;
  trade_price: number;
  quantity: number;
  evaluation_amount: number; // 평가 금액
  profit_loss: number; // 평가 손익
  profit_loss_rate: number; // 평가 수익률 (%)
}