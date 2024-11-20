export type CalculatePercentage = {
	percentage: number;
};

export type Trade = {
	message: string;
	statusCode: number;
};

export type CheckCoin = {
	message: string;
	statusCode: number;
	own: boolean;
};

export type PendingCoinAPI = {
	statusCode: number;
	message: 'string';
	result: PendingCoin[];
};

export type PendingCoin = {
	img_url: string;
	koreanName: string;
	coin: string;
	market: string;
	tradeId: number;
	tradeType: 'sell' | 'buy';
	price: number;
	quantity: number;
	createdAt: string;
	userId: number;
};
