export type Account = {
	KRW: number;
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
};
