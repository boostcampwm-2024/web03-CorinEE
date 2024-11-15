import axios from 'axios';

export const instance = axios.create({
	baseURL: ' https://175.106.98.147:3000',
	timeout: 2000,
});

export const upbitInstance = axios.create({
	baseURL: ' https://api.upbit.com/v1',
	timeout: 2000,
});
