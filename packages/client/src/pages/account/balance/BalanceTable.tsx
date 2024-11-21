import BalanceInfo from '@/pages/account/balance/BalanceInfo';
import { Change } from '@/types/ticker';

type BalanceTableProps = {
	KRW: number;
	total_bid: number;
	totalEvaluation: number;
};

function BalanceTable({ KRW, total_bid, totalEvaluation }: BalanceTableProps) {
	const profitRate = ((totalEvaluation - total_bid) / total_bid) * 100 || 0;

	const change: Change =
		profitRate === 0 ? 'EVEN' : profitRate > 0 ? 'RISE' : 'FALL';

	return (
		<div className="flex p-4 flex-col w-3/5 border-r-2 border-gray-300 border-solid">
			<div className="flex h-20 gap-8 items-center">
				<BalanceInfo
					title="보유 KRW"
					amount={KRW}
					unit="KRW"
					primary={true}
					change={change}
				/>
				<BalanceInfo
					title="총 보유자산"
					amount={totalEvaluation + KRW}
					unit="KRW"
					primary={true}
					change={change}
				/>
			</div>
			<div className="border border-solid border-gray-300 my-3"></div>

			<div className="flex h-10 gap-8 items-center">
				<BalanceInfo
					title="총 매수"
					amount={total_bid}
					unit="KRW"
					primary={false}
					change={change}
				/>
				<BalanceInfo
					title="총평가손익"
					amount={totalEvaluation - total_bid}
					unit="KRW"
					primary={false}
					change={change}
				/>
			</div>
			<div className="flex h-10 gap-8 items-center">
				<BalanceInfo
					title="총 평가"
					amount={totalEvaluation}
					unit="KRW"
					primary={false}
					change={change}
				/>
				<BalanceInfo
					title="총평가수익률"
					amount={profitRate}
					unit="%"
					primary={false}
					change={change}
				/>
			</div>
			<div className="flex h-10 gap-8 items-center">
				<BalanceInfo
					title="주문가능"
					amount={0}
					unit="KRW"
					primary={false}
					change={change}
				/>
				<div className="flex-[1]"></div>
			</div>
		</div>
	);
}

export default BalanceTable;
