export type AccountHistory = {
	assetName: string;
	createdAt: string;
	price: number;
	quantity: number;
	tradeCurrency: string;
	tradeDate: string;
	tradeHistoryId?: number;
	tradeType: string;
};

export type Period = 'ONE_WEEK' | 'ONE_MONTH' | 'THREE_MONTH' | 'SIX_MONTH' | 'TOTAL'

export type Option = 'TOTAL' | 'BUY' | 'SELL'
