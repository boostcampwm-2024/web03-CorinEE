import { authInstance } from '@/api/instance';
import { Market } from '@/types/market';
import { CheckCoin, PendingCoinAPI, Trade } from '@/types/trade';
import '@/api/interceptors';

type CalculateAPI = {
	askType: 'ask' | 'bid';
	moneyType: Market | string;
	percent: number;
};

export async function calculatePercentageBuy({
	askType,
	moneyType,
	percent,
}: CalculateAPI): Promise<number> {
	const response = await authInstance.get(
		`/trade/calculate-percentage-${askType}/${moneyType}?percent=${percent}`,
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

export async function trade(params: TradeAPI): Promise<Trade> {
	const response = await authInstance.post(`/trade/${params.askType}`, {
		typeGiven: params.typeGiven,
		typeReceived: params.typeReceived,
		receivedPrice: params.receivedPrice,
		receivedAmount: params.receivedAmount,
	});

	return response.data;
}

export async function checkCoin(coin: string): Promise<CheckCoin> {
	const response = await authInstance.get(`/trade/check-coindata?coin=${coin}`);
	return response.data;
}

export async function pendingCoin(coin: string): Promise<PendingCoinAPI> {
	const response = await authInstance.get(`/trade/tradeData?coin=${coin}`);
	return response.data;
}
