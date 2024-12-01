import { getProfile } from '@/api/auth';
import { useSuspenseQuery } from '@tanstack/react-query';

export function useMyProfile() {
	const QUERY_KEY = 'MY_PROFILE';
	const { data } = useSuspenseQuery({
		queryFn: getProfile,
		queryKey: [QUERY_KEY],
	});
	return { data };
}
