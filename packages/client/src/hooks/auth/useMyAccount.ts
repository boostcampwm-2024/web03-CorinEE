import { myAccount } from '@/api/acoount';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useMyAccount() {
	const QUERY_KEY = 'MY_ACCOUNT';
	const { data } = useSuspenseQuery({
		queryFn: () => myAccount(),
		queryKey: [QUERY_KEY],
		refetchOnMount: 'always',
		retry: 0,
	});

	return { data };
}
