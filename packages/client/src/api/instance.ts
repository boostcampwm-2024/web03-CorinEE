import axios from 'axios';
import {config} from 'dotenv'

config();

export const instance = axios.create({
	baseURL: process.env.VITE_API_BASE_URL,
	withCredentials: true,
	timeout: 2000,
});

export const upbitInstance = axios.create({
	baseURL: ' https://api.upbit.com/v1',
	timeout: 2000,
});
