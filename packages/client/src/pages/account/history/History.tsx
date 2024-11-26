import { useMyHistory } from '@/hooks/useMyHistory';
import HistoryInfo from '@/pages/account/history/HistoryInfo';
import HistoryOption from '@/pages/account/history/HistoryOption';
import HistoryPeriod from '@/pages/account/history/HistoryPeriod';
import { AccountHistory, Option, Period } from '@/types/history';
import {
	filterByDate,
	filterByTradeType,
	getDateRange,
} from '@/utility/historyUtils';
import { useMemo, useState } from 'react';

function History() {
	const histories = useMyHistory();
	const [period, setPeriod] = useState<Period>('ONE_WEEK');
	const [option, setOption] = useState<Option>('TOTAL');

	const filteredHistories = useMemo(() => {
		const dateRange = getDateRange(period);

		return histories.filter(
			(history) =>
				filterByDate(history, dateRange) && filterByTradeType(history, option),
		);
	}, [histories, period, option]);

	const handlePeriod = (period: Period) => {
		setPeriod(period);
	};

	const handleOption = (option: Option) => {
		setOption(option);
	};

	return (
		<>
			<div className="flex">
				<HistoryPeriod period={period} handlePeriod={handlePeriod} />
				<HistoryOption option={option} handleOption={handleOption} />
			</div>

			<div className=" w-full mt-5">
				<div className="flex  text-center text-sm bg-gray-100  border-b border-solid border-gray-300 py-2">
					<div className="flex-[2]">체결시간</div>
					<div className="flex-[1]">코인</div>
					<div className="flex-[1]">종류</div>
					<div className="flex-[3]">거래수량</div>
					<div className="flex-[3]">거래단가</div>
					<div className="flex-[3]">거래금액</div>
					<div className="flex-[2]">주문시간</div>
				</div>

				{filteredHistories.map((history) => (
					<HistoryInfo key={history.tradeHistoryId} {...history} />
				))}
			</div>
		</>
	);
}

export default History;
