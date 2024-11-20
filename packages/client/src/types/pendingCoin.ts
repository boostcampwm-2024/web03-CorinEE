export type PendingCoinAPI = {
	statusCode: number;
	message: 'string';
	tradeData: PendingCoin[];
};

export type PendingCoin = {
	img_url: string;
	koreanName: string;
	coin: string;
	market: string;
	tradeId: number;
	tradeType: string;
	price: number;
	quantity: number;
	createdAt: string;
	userId: number;
};
