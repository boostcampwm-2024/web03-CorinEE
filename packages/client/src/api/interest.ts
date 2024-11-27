import { authInstance } from '@/api/instance';
import { Interest } from '@/types/interest';

export async function myInterest(): Promise<Interest[]> {
	const response = await authInstance.get(`/favorite`);

	return response.data.result;
}

export async function toggleMyInterest(market: string): Promise<void> {
	await authInstance.post(`/favorite/toggle?assetName=${market}`);
}
