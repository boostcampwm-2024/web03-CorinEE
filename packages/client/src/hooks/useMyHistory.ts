import { myHistory } from '@/api/history';
import { getCookie } from '@/utility/cookies';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useMyHistory() {
	const QUERY_KEY = 'MY_History';
	const token = getCookie('access_token');
	const  {data}  = useSuspenseQuery({
		queryFn: () => myHistory(token),
		queryKey: [QUERY_KEY],
		refetchOnMount: 'always',
	});


	return data;
}
