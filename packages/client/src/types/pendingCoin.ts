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
