import { convertToQueryString } from '@/utility/api/queryString';
import { useQuery } from '@tanstack/react-query';
import { getRecentlyMarketList } from '@/api/market';
import { Interest } from '@/types/interest';

export function useRecentlyMarketList(myInterest: Interest[]) {
	const isEnable = myInterest.length ? true : false;
	const interestMarketList = myInterest.map((info) => info.assetName);
	const queryString = convertToQueryString(interestMarketList);

	const { isPending, error, data } = useQuery({
		queryKey: ['recentlyMarketList', queryString],
		queryFn: () => getRecentlyMarketList(queryString),
		enabled: isEnable,
		staleTime: 1000 * 60, // 1분
		gcTime: 1000 * 60 * 5, // 5분
	});

	return { isPending, error, data };
}
