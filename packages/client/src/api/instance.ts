import axios from 'axios';

export const instance = axios.create({
	baseURL: ' https://api.upbit.com/v1',
	timeout: 2000,
});

