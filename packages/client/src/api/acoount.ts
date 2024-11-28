import '@/api/interceptors';
import { authInstance } from '@/api/instance';
import { Account } from '@/types/account';

export async function myAccount(): Promise<Account> {
	const response = await authInstance.get(`/account/myaccount`);
	return response.data;
}

export async function resetAccount() {
	const response = await authInstance.delete('/user/reset');
	return response.data;
}
