import { adminLogin } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import { setCookie } from '@/utility/cookies';
import { useMutation } from '@tanstack/react-query';

export function useAuth() {
	const checkAuth = useAuthStore((state) => state.checkAuth);
	const useAdminLogin = useMutation({
		mutationFn: adminLogin,
		onSuccess: ({ access_token }: { access_token: string }) => {
			setCookie('access_token', access_token, {
				path: '/',
				maxAge: 24 * 60 * 60,
			});
			checkAuth();
		},
		onError: (error) => {
			console.error(error);
		},
	});
	return useAdminLogin;
}
