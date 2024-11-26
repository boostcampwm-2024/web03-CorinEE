import { MINIMUM_TRADE_AMOUNT } from "../constants/trade.constants";

export const formatQuantity = (value: number): number => 
  parseFloat(value.toFixed(8));

export const calculateAccountBalance = (
  currentBalance: number,
  price: number,
  quantity: number
): number => formatQuantity(currentBalance + price * quantity);

export const isMinimumQuantity = (quantity: number): boolean => 
  quantity < MINIMUM_TRADE_AMOUNT;