export type AccountWaitOrder = {
	coin: string;
	createdAt: string;
	img_url: string;
	koreanName: string;
	market: string;
	price: number;
	quantity: number;
	tradeId: number;
	tradeType: 'sell' | 'buy';
	userId: number;
};
