export type Market = 'KRW' | 'BTC' | 'USDT';

type MarketEvent = {
	CONCENTRATION_OF_SMALL_ACCOUNTS: boolean;
	DEPOSIT_AMOUNT_SOARING: boolean;
	GLOBAL_PRICE_DIFFERENCES: boolean;
	PRICE_FLUCTUATIONS: boolean;
	TRADING_VOLUME_SOARING: boolean;
};

export type MarketData = {
	market: string;
	korean_name: string;
	english_name: string;
	market_warning?: string;
	market_event: { warning: boolean; caution: MarketEvent };
};
