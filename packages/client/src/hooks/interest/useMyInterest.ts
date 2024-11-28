import { myInterest } from '@/api/interest';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
export function useMyInterest() {
	const QUERY_KEY = 'MY_INTEREST';
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const { data, isLoading } = useQuery({
		queryFn: () => myInterest(),
		queryKey: [QUERY_KEY],
		enabled: isAuthenticated,
	});

	return { data, isLoading };
}
