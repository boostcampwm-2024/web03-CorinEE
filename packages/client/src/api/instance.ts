import axios from 'axios';

export const instance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 2000,
});

export const authInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 2000,
	withCredentials: true,
});

export const upbitInstance = axios.create({
	baseURL: ' https://api.upbit.com/v1',
	timeout: 2000,
});
