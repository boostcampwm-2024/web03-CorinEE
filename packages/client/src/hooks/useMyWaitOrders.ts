import { myWaitOrders } from '@/api/waitOrders';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useMyWaitOrders() {
	const QUERY_KEY = 'MY_WAIT_ORDERS';
	const { data } = useSuspenseQuery({
		queryFn: () => myWaitOrders(),
		queryKey: [QUERY_KEY],
		refetchOnMount: 'always',
	});

	return data;
}
