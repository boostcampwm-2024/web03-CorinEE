import { myHistory } from '@/api/history';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useMyHistory() {
	const QUERY_KEY = 'MY_History';
	const { data } = useSuspenseQuery({
		queryFn: () => myHistory(),
		queryKey: [QUERY_KEY],
		refetchOnMount: 'always',
	});

	return data;
}
