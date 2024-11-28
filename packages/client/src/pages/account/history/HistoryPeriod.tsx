import { Period } from '@/types/history';
import { getCustomDateRange } from '@/utility/historyUtils';

type HistoryPeriodProps = {
	period: Period;
	handlePeriod: (period: Period) => void;
};

function HistoryPeriod({ period, handlePeriod }: HistoryPeriodProps) {
	const { startDate, endDate } = getCustomDateRange(period);

	return (
		<div className="flex flex-col w-[500px]">
			<div className="pt-6 pb-2">
				<span>기간</span>
				<span className="text-gray-600 text-sm pl-2">
					{period !== 'TOTAL' && `${startDate} ~ ${endDate}`}
				</span>
			</div>
			<div className="flex text-gray-700 cursor-pointer text-center">
				<div
					className={`py-3 px-4 w-20 border-solid 
					${
						period === 'ONE_WEEK'
							? 'border-2 border-blue-600 text-blue-800'
							: period === 'ONE_MONTH'
								? 'border-y border-l border-gray-400'
								: 'border border-gray-400'
					}`}
					onClick={() => {
						handlePeriod('ONE_WEEK');
					}}
				>
					1주일
				</div>
				<div
					className={`py-3 px-4 w-20 border-solid 
					${
						period === 'ONE_MONTH'
							? 'border-2 border-blue-600 text-blue-800'
							: period === 'THREE_MONTH'
								? 'border-y border-gray-400'
								: 'border-y border-r border-gray-400'
					}`}
					onClick={() => {
						handlePeriod('ONE_MONTH');
					}}
				>
					1개월
				</div>
				<div
					className={`py-3 px-4 w-20 border-solid 
					${
						period === 'THREE_MONTH'
							? 'border-2 border-blue-600 text-blue-800'
							: period === 'SIX_MONTH'
								? 'border-y border-gray-400'
								: 'border-y border-r border-gray-400'
					}`}
					onClick={() => {
						handlePeriod('THREE_MONTH');
					}}
				>
					3개월
				</div>
				<div
					className={`py-3 px-4 w-20 border-solid 
					${
						period === 'SIX_MONTH'
							? 'border-2 border-blue-600 text-blue-800'
							: period === 'TOTAL'
								? 'border-y border-gray-400'
								: 'border-y border-r border-gray-400'
					}`}
					onClick={() => {
						handlePeriod('SIX_MONTH');
					}}
				>
					6개월
				</div>
				<div
					className={`py-3 px-4 w-24 border-solid 
					${period === 'TOTAL' ? 'border-2 border-blue-600 text-blue-800' : 'border-y border-r border-gray-400'}`}
					onClick={() => {
						handlePeriod('TOTAL');
					}}
				>
					모든내역
				</div>
			</div>
		</div>
	);
}

export default HistoryPeriod;
