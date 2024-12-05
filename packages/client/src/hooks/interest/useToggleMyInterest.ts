import { toggleMyInterest } from '@/api/interest';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useToggleMyInterest() {
	const QUERY_KEY = 'TOGGLE_INTEREST';
	const queryClient = useQueryClient();

	const toggleInterest = useMutation({
		mutationFn: (market: string) => toggleMyInterest(market),
		mutationKey: [QUERY_KEY],

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['MY_INTEREST'] });
		},
	});
	return { toggleInterest };
}
