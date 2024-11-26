import { myWaitOrders } from '@/api/waitOrders';
import { getCookie } from '@/utility/storage/cookies';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useMyWaitOrders() {
	const QUERY_KEY = 'MY_WAIT_ORDERS';
	const token = getCookie('access_token');
	const  {data}  = useSuspenseQuery({
		queryFn: () => myWaitOrders(token),
		queryKey: [QUERY_KEY],
		refetchOnMount: 'always',
	});


	return data;
}
