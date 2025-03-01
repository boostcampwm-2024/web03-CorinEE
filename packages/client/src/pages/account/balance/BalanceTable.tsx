import BalanceInfo from '@/pages/account/balance/BalanceInfo';
import { BalanceMarket } from '@/types/market';
import { SSEDataType } from '@/types/ticker';
import PORTFOLIO_EVALUATOR from '@/utility/finance/portfolioEvaluator';

type BalanceTableProps = {
	KRW: number;
	total_bid: number;
	availableKRW: number
	sseData: SSEDataType | null | undefined;
	balanceMarketList: BalanceMarket[];
};

function BalanceTable({
	KRW,
	total_bid,
	sseData,
	balanceMarketList,
	availableKRW
}: BalanceTableProps) {
	const { evaluateTotalPrice, calculateProfitRate, getChangeStatus } =
		PORTFOLIO_EVALUATOR;

	const totalEvaluation = evaluateTotalPrice(balanceMarketList, sseData);

	const profitRate = calculateProfitRate(totalEvaluation, total_bid) || 0;
	const changeStatus = getChangeStatus(profitRate);

	return (
		<div className="flex p-4 flex-col w-3/5 border-r-2 border-gray-300 border-solid">
			<div className="flex h-20 gap-8 items-center">
				<BalanceInfo
					title="보유 KRW"
					amount={Math.floor(KRW)}
					unit="KRW"
					primary={true}
					change={changeStatus}
				/>
				<BalanceInfo
					title="총 보유자산"
					amount={Math.floor(totalEvaluation + KRW)}
					unit="KRW"
					primary={true}
					change={changeStatus}
				/>
			</div>
			<div className="border border-solid border-gray-300 my-3"></div>

			<div className="flex h-10 gap-8 items-center">
				<BalanceInfo
					title="총 매수"
					amount={Math.floor(total_bid)}
					unit="KRW"
					primary={false}
					change={changeStatus}
				/>
				<BalanceInfo
					title="총평가손익"
					amount={Math.floor(totalEvaluation - total_bid)}
					unit="KRW"
					primary={false}
					change={changeStatus}
				/>
			</div>
			<div className="flex h-10 gap-8 items-center">
				<BalanceInfo
					title="총 평가"
					amount={Math.floor(totalEvaluation)}
					unit="KRW"
					primary={false}
					change={changeStatus}
				/>
				<BalanceInfo
					title="총평가수익률"
					amount={Math.round(profitRate * 1000) / 1000}
					unit="%"
					primary={false}
					change={changeStatus}
				/>
			</div>
			<div className="flex h-10 gap-8 items-center">
				<BalanceInfo
					title="주문가능"
					amount={Math.floor(availableKRW)}
					unit="KRW"
					primary={false}
					change={changeStatus}
				/>
				<div className="flex-[1]"></div>
			</div>
		</div>
	);
}

export default BalanceTable;
