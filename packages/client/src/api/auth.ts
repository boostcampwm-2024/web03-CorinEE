import { instance } from '@/api/instance';
import { LogOut, Login } from '@/types/auth';

export async function guestLogin(): Promise<Login> {
	const response = await instance.post('/auth/guest-login');
	return response.data;
}

export async function logout(token: string): Promise<LogOut> {
	const response = await instance.delete('/auth/logout', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
}
