import { getAllUserInvestment } from '@/api/acoount';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useAllUserInvestment() {
	const QUERY_KEY = 'USERS_INVESTMENT';
	const { data } = useSuspenseQuery({
		queryFn: getAllUserInvestment,
		queryKey: [QUERY_KEY],
		refetchOnMount: true,
	});
	return { data };
}
