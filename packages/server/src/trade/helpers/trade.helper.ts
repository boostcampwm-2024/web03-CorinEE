import { MINIMUM_TRADE_AMOUNT } from '../constants/trade.constants';

export const formatQuantity = (value: number | string): number => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  return parseFloat(numericValue.toFixed(8));
};

export const calculateAccountBalance = (
  currentBalance: number,
  price: number,
  quantity: number,
): number => formatQuantity(currentBalance + price * quantity);

export const isMinimumQuantity = (quantity: number): boolean =>
  quantity < MINIMUM_TRADE_AMOUNT;
