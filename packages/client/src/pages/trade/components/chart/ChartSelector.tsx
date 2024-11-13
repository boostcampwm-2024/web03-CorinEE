import { CandlePeriod } from '@/types/chart';

type ChartSelector = {
	activePeriods: CandlePeriod;
	handleActivePeriod: (period: CandlePeriod) => void;
};

function ChartSelector({ activePeriods, handleActivePeriod }: ChartSelector) {
	const PERIODS: { label: string; id: CandlePeriod }[] = [
		{
			label: '일',
			id: 'days',
		},
		{
			label: '주',
			id: 'weeks',
		},
		{
			label: '월',
			id: 'months',
		},
		{
			label: '년',
			id: 'years',
		},
	];

	return (
		<div className="text-sm flex gap-6 py-2 pl-3 items-center">
			<span className="font-semibold text-gray-900">차트</span>
			<div className="flex gap-3">
				{PERIODS.map(({ label, id }) => (
					<button
						key={id}
						className={`text-gray-900 py-1 px-3 rounded-md ${activePeriods === id ? 'bg-gray-300' : ''} hover:bg-gray-200`}
						onClick={() => handleActivePeriod(id)}
					>
						{label}
					</button>
				))}
			</div>
		</div>
	);
}

export default ChartSelector;
