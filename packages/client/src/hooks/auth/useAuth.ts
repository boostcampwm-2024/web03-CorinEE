import { guestLogin, logout } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { Login } from '@/types/auth';
import { removeCookie, setCookie } from '@/utility/storage/cookies';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/ui/useToast';
export function useAuth() {
	const toast = useToast();
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
			toast.success('안녕하세요');
		},
		onError: (error) => {
			console.error(error);
			toast.error(error.message);
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
			toast.success('로그아웃 했어요');
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
