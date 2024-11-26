import { guestLogin, logout } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { Login } from '@/types/auth';
import { removeCookie, setCookie } from '@/utility/storage/cookies';
import { useMutation } from '@tanstack/react-query';

export function useAuth() {
	const checkAuth = useAuthStore((state) => state.checkAuth);
	const logoutAuth = useAuthStore((state) => state.logout);
	const useGuestLogin = useMutation({
		mutationFn: guestLogin,
		onSuccess: ({ access_token, refresh_token }: Login) => {
			setCookie('refresh_token', refresh_token, {
				path: '/',
			});
			localStorage.setItem('access_token', access_token);
			checkAuth();
		},
		onError: (error) => {
			alert(`로그인을 실패했습니다! ${error.message}`);
			console.error(error);
		},
	});

	const useLogout = useMutation({
		mutationFn: async () => {
			return logout();
		},
		onSuccess: () => {
			localStorage.removeItem('access_token');
			removeCookie('refresh_token');
			logoutAuth();
		},
		onError: (error: Error) => {
			console.error('Logout error:', error);
		},
	});
	return {
		guestLogin: useGuestLogin,
		logout: useLogout,
	};
}
