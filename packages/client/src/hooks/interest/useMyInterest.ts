import { myInterest } from '@/api/interest';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useMyInterest() {
	const QUERY_KEY = 'MY_INTEREST';
	const { data } = useSuspenseQuery({
		queryFn: () => myInterest(),
		queryKey: [QUERY_KEY],
		refetchOnMount: 'always',
	});

	return data;
}
