import { create } from 'zustand';
import { getCookie, removeCookie } from '@/utility/storage/cookies';
interface AuthState {
	isAuthenticated: boolean;
	isLoading: boolean;
	isGuestLogin: boolean;
	checkAuth: () => void;
	logout: () => void;
	getToken: () => string | null;
	checkGuestLogin: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated: !!localStorage.getItem('access_token'),
	isGuestLogin: false,
	isLoading: false,

	checkAuth: () => {
		const hasToken = !!localStorage.getItem('access_token');
		set({ isAuthenticated: hasToken });
	},

	logout: () => {
		removeCookie('access_token', { path: '/', httpOnly: true });
		set({ isAuthenticated: false });
	},

	checkGuestLogin: () => {
		set({ isGuestLogin: true });
	},
	getToken: () => getCookie('access_token'),
}));
