import { instance } from '@/api/instance';

export async function adminLogin() {
	const response = await instance.post('/auth/login', {
		username: 'admin',
	});
	return response.data;
}
