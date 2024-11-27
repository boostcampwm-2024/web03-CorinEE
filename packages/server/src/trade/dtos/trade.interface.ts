import { Timestamp } from "typeorm";
import { TRADE_TYPES } from '../constants/trade.constants';

export interface TradeResponse {
  statusCode: number;
  message: string;
  result?: any;
  own?: boolean;
}

export interface CoinPriceDto {
  give: string;
  receive: string;
  price: number;
}

export interface TradeData {
  userId: number;
  typeGiven: string;
  typeReceived: string;
  receivedPrice: number;
  receivedAmount: number;
  tradeId?: number;
  krw?: number;
  account?: any;
  accountBalance?: number;
  asset?: any;
  assetBalance?: number;
}

export interface TradeDataRedis{
  tradeId: number;
  userId: number;
  tradeType: TRADE_TYPES.BUY | TRADE_TYPES.SELL;
  tradeCurrency: string;
  assetName: string;
  price: number;
  quantity: number;
  createdAt: Date;
}
export interface OrderBookEntry {
  ask_price?: number;
  bid_price?: number;
  ask_size?: number;
  bid_size?: number;
}

export interface TradeResponse {
  statusCode: number;
  message: string;
  result?: any;
}
