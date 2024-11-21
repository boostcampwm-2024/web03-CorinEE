import { instance } from '@/api/instance';
import { Account } from '@/types/account';

export async function myAccount(token: string): Promise<Account> {
	const response = await instance.get(`/api/account/myaccount`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
}
