import '@/api/interceptors';
import { authInstance, instance } from '@/api/instance';
import { LogOut, Login, Profile } from '@/types/auth';

export async function guestLogin(): Promise<Login> {
	const response = await instance.post('/auth/guest-login');
	return response.data;
}

export async function logout(): Promise<LogOut> {
	const response = await authInstance.delete('/auth/logout');
	return response.data;
}

export async function getProfile(): Promise<Profile> {
	const response = await authInstance.get('/auth/profile');
	return response.data;
}
