import { guestLogin, logout } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { getCookie, setCookie } from '@/utility/cookies';
import { useMutation } from '@tanstack/react-query';

export function useAuth() {
	const checkAuth = useAuthStore((state) => state.checkAuth);
	const logoutAuth = useAuthStore((state) => state.logout);

	const useGuestLogin = useMutation({
		mutationFn: guestLogin,
		onSuccess: ({ access_token }: { access_token: string }) => {
			setCookie('access_token', access_token, {
				path: '/',
				maxAge: 24 * 60 * 60,
			});
			checkAuth();
		},
		onError: (error) => {
			alert(`로그인을 실패했습니다! ${error.message}`);
			console.error(error);
		},
	});

	const useLogout = useMutation({
		mutationFn: async () => {
			const token = getCookie('access_token');
			if (!token) return;
			return logout(token);
		},
		onSuccess: () => {
			logoutAuth();
		},
		onError: (error: Error) => {
			console.error('Logout error:', error);
		},
	});
	return { login: useGuestLogin, logout: useLogout };
}
