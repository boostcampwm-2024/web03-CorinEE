import { create } from 'zustand';
import { getCookie, removeCookie } from '@/utility/storage/cookies';
interface AuthState {
	isAuthenticated: boolean;
	checkAuth: () => void;
	logout: () => void;
	getToken: () => string | null;
}

export const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated: !!localStorage.getItem('access_token'),

	checkAuth: () => {
		const hasToken = !!localStorage.getItem('access_token');
		set({ isAuthenticated: hasToken });
	},

	logout: () => {
		removeCookie('access_token', { path: '/', httpOnly: true });
		set({ isAuthenticated: false });
	},

	getToken: () => getCookie('access_token'),
}));
