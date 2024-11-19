import { instance } from '@/api/instance';
import { Market } from '@/types/market';

type CalculateAPI = {
	askType: 'ask' | 'bid';
	moneyType: Market | string;
	percent: number;
};

export async function calculatePercentageBuy(
	{ askType, moneyType, percent }: CalculateAPI,
	token: string,
) {
	const response = await instance.get(
		`/trade/calculate-percentage-${askType}/${moneyType}?percent=${percent}`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);
	return response.data;
}

type TradeAPI = {
	askType: 'bid' | 'ask';
	typeGiven: Market | string;
	typeReceived: Market | string;
	receivedPrice: number;
	receivedAmount: number;
};

export async function trade(params: TradeAPI, token: string) {
	const response = await instance.post(
		`/trade/${params.askType}`,
		{
			typeGiven: params.typeGiven,
			typeReceived: params.typeReceived,
			receivedPrice: params.receivedPrice,
			receivedAmount: params.receivedAmount,
		},
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);

	return response.data;
}

export async function checkCoin(coin: string, token: string) {
	const response = await instance.get(`/trade/check-coinData/${coin}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
}
