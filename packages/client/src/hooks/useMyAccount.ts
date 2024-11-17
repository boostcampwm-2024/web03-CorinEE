import { myAccount } from '@/api/account';
import { getCookie } from '@/utility/cookies';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useMyAccount() {
	const QUERY_KEY = 'MY_ACCOUNT';
	const token = getCookie('access_token');
	const { data } = useSuspenseQuery({
		queryFn: () => myAccount(token),
		queryKey: [QUERY_KEY],
	});

	return { data };
}