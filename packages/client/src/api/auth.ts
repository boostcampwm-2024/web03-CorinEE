import { instance } from '@/api/instance';

export async function guestLogin() {
	const response = await instance.post('/auth/guest-login');
	return response.data;
}

export async function logout(token: string) {
	const response = await instance.delete('/auth/logout', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
}
