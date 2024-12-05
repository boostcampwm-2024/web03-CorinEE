import '@/api/interceptors';
import { authInstance, instance } from '@/api/instance';
import { Account, UserInvestment } from '@/types/account';

export async function myAccount(): Promise<Account> {
	const response = await authInstance.get(`/account/myaccount`);
	return response.data;
}

export async function resetAccount() {
	const response = await authInstance.delete('/user/reset');
	return response.data;
}

export async function getAllUserInvestment(): Promise<UserInvestment[]> {
	const response = await instance.get('/user/all-users-account');
	return response.data;
}
