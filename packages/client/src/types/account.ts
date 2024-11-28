export type Account = {
	KRW: number;
	availableKRW: number;
	total_bid: number;
	coins: AccountCoin[];
};

export type AccountCoin = {
	img_url: string;
	koreanName: string;
	market: string;
	quantity: number;
	price: number;
	averagePrice: number;
	availableQuantity: number;
};

export type CategoryKey = 'balance' | 'history' | 'wait_orders';

export type CategoryInfo = {
	[K in CategoryKey]: {
		text: string;
		path: string;
	};
};
