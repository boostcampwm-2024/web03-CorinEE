import { create } from 'zustand';
import { getCookie, removeCookie } from '@/utility/cookies';
interface AuthState {
	isAuthenticated: boolean;
	isLoading: boolean;
	checkAuth: () => void;
	logout: () => void;
	getToken: () => string | null;
}

export const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated: !!getCookie('access_token'),
	isLoading: false,

	checkAuth: () => {
		const hasToken = !!getCookie('access_token');
		set({ isAuthenticated: hasToken });
	},

	logout: () => {
		removeCookie('access_token');
		set({ isAuthenticated: false });
	},

	getToken: () => getCookie('access_token'),
}));
