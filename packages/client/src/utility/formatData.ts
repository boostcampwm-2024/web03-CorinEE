import { MarketCategory } from "@/types/menu";

type Formatters = {
	formatTradePrice: (price: number) => string;
	formatSignedChangePrice: (price: number) => string;
	formatChangeRate: (price: number) => string;
	formatAccTradePrice: (price: number) => string;
};

export const formatData = (category: MarketCategory) => {
	const formatters: Formatters = {
		formatTradePrice: () => '',
		formatSignedChangePrice: () => '',
		formatChangeRate: () => '',
		formatAccTradePrice: () => '',
	};

	switch (category) {
		case 'KRW':
			formatters.formatTradePrice = (price: number) =>
				`${Number(price).toLocaleString()}원`;

			formatters.formatSignedChangePrice = (price: number) =>
				`${Number(price).toLocaleString()}원`;

			formatters.formatChangeRate = (price: number) =>
				`(${(Number(price) * 100).toFixed(2)}%)`;

			formatters.formatAccTradePrice = (price: number) =>
				`${Math.floor(Number(price) / 1000000).toLocaleString()}백만`;
			break;

		case 'BTC':
			formatters.formatTradePrice = (price: number) =>
				`${Number(price).toFixed(8)} BTC`;

			formatters.formatSignedChangePrice = () => ``;

			formatters.formatChangeRate = (price: number) =>
				`${(Number(price) * 100).toFixed(2)}%`;

			formatters.formatAccTradePrice = (price: number) =>
				`${Number(price).toFixed(3)}`;
			break;
		case 'USDT':
			formatters.formatTradePrice = (price: number) =>
				`${Number(price).toLocaleString()} USDT`;

			formatters.formatSignedChangePrice = () => ``;

			formatters.formatChangeRate = (price: number) =>
				`${(Number(price) * 100).toFixed(2)}%`;

			formatters.formatAccTradePrice = (price: number) =>
				`${Math.floor(Number(price)).toLocaleString()}`;
			break;
	}

	return formatters;
};