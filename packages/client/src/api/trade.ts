import { instance } from '@/api/instance';
import { Market } from '@/types/market';

type CalculateAPI = {
	moneyType: Market;
	percent: number;
};

export async function calculatePercentageBuy(
	{ moneyType, percent }: CalculateAPI,
	token: string,
) {
	const response = await instance.get(
		`/trade/calculate-percentage-buy/${moneyType}?percent=${percent}`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	);
	return response.data;
}
