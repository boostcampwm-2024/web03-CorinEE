import { instance } from '@/api/instance';

export async function guestLogin() {
	const response = await instance.post('/auth/guest-login');
	return response.data;
}
