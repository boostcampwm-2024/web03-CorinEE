import { Change } from '@/types/ticker';
import colorClasses from '@/constants/priceColor';

type BalanceInfoProps = {
	title: string;
	amount: number;
	unit: string;
	primary: boolean;
	change: Change;
};

function BalanceInfo({
	title,
	amount,
	unit,
	primary,
	change,
}: BalanceInfoProps) {
	return (
		<div className="flex-[1] flex items-center justify-between">
			<span className="font-semibold text-gray-700">{title}</span>
			<div>
				<span
					className={`font-semibold 
          ${primary ? 'text-2xl' : 'text-lg'}
					${(title === '총평가손익' || title === '총평가수익률') && colorClasses[change]}`}
				>
					{amount.toLocaleString()}
				</span>
				<span className="font-semibold text-xs ml-2 text-gray-500">{unit}</span>
			</div>
		</div>
	);
}

export default BalanceInfo;
