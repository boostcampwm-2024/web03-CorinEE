import { authInstance, instance } from '@/api/instance';
import { Login } from '@/types/auth';
import { getCookie, removeCookie, setCookie } from '@/utility/storage/cookies';
import { AxiosResponse } from 'axios';

authInstance.interceptors.request.use(
	(config) => {
		const access_token = localStorage.getItem('access_token');
		if (access_token) {
			config.headers.Authorization = `Bearer ${access_token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

authInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response.status === 401) {
			try {
				const response: AxiosResponse<Login> = await instance.post(
					'/auth/refresh',
					{
						refreshToken: getCookie('refresh_token'),
					},
					{ withCredentials: true },
				);
				const new_access_token = response.data.access_token;
				const new_refresh_token = response.data.refresh_token;
				localStorage.setItem('access_token', new_access_token);
				setCookie('refresh_token', new_refresh_token, {
					path: '/',
				});
				originalRequest.headers.Authorization = `Bearer ${new_access_token}`;
				return authInstance(originalRequest);
			} catch (error) {
				localStorage.removeItem('access_token');
				removeCookie('refresh_token');
				location.reload();
				return Promise.reject(error);
			}
		}
		return Promise.reject(error);
	},
);

export { authInstance };
