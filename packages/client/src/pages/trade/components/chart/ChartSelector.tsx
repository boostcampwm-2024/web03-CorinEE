import MinuteDropDown from '@/pages/trade/components/chart/MinuteDropDown';
import { CandlePeriod } from '@/types/chart';
import { PERIODS } from '@/constants/chartSelector';

type ChartSelector = {
	activePeriods: CandlePeriod;
	handleActivePeriod: (period: CandlePeriod) => void;
};

function ChartSelector({ activePeriods, handleActivePeriod }: ChartSelector) {
	return (
		<div className="text-sm flex gap-6 py-2 pl-3 items-center">
			<span className="font-semibold text-gray-900">차트</span>
			<div className="flex gap-3">
				{PERIODS.map(({ label, id }) =>
					id === 'minutes' ? (
						<MinuteDropDown
							key={id}
							active={activePeriods === id}
							handleActivePeriod={handleActivePeriod}
						/>
					) : (
						<button
							key={id}
							className={`text-gray-900 py-1 px-3 rounded-md ${activePeriods === id ? 'bg-gray-300' : ''} hover:bg-gray-200`}
							onClick={() => handleActivePeriod(id)}
						>
							{label}
						</button>
					),
				)}
			</div>
		</div>
	);
}

export default ChartSelector;
