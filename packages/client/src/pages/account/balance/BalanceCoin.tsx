import { Change, CoinTicker } from '@/types/ticker';
import colorClasses from '@/constants/priceColor';
import { AccountCoin } from '@/types/account';
import PORTFOLIO_EVALUATOR from '@/utility/finance/portfolioEvaluator';
import { Link } from 'react-router-dom';

type BalanceCoinProps = {
	coin: AccountCoin;
	sseData: CoinTicker | null;
};

function BalanceCoin({ coin, sseData }: BalanceCoinProps) {
	const {
		evaluatePerPrice,
		calculateProfitPrice,
		calculateProfitRate,
		getChangeStatus,
	} = PORTFOLIO_EVALUATOR;

	if (!sseData) return;

	const averagePrice = coin.price / coin.quantity;

	const evaluationPerPrice = evaluatePerPrice(
		coin.quantity,
		sseData.trade_price,
	);

	const profitPrice = calculateProfitPrice(evaluationPerPrice, coin.price);

	const profitRate = calculateProfitRate(evaluationPerPrice, coin.price);

	const roundedProfitRate = Math.round(profitRate * 1000) / 1000;

	const change: Change = getChangeStatus(profitRate);

	return (
		<div className="flex border-b border-solid border-gray-300">
			<div className="flex-[1]  pt-3 px-3">
				<Link to={`/trade/${`KRW-${coin.market}`}`}>
					<div className="flex items-center gap-3">
						<img className="w-7 h-7" src={coin.img_url} />
						<div className="flex flex-col">
							<p className="font-semibold">{coin.koreanName}</p>
							<p className="text-gray-700 text-xs">{coin.market}</p>
						</div>
					</div>
				</Link>
			</div>
			<div className="flex-[1] p-3 text-end">
				<span className="text-base ">{coin.quantity.toLocaleString()}</span>
				<span className="text-xs ml-1 text-gray-500">{coin.market}</span>
			</div>
			<div className="flex-[1] p-3 text-end">
				<span className="text-base">
					{averagePrice < 1
						? averagePrice.toFixed(3)
						: Math.floor(averagePrice).toLocaleString()}
				</span>
				<span className="text-xs ml-1 text-gray-500">KRW</span>
			</div>
			<div className="flex-[1] p-3 text-end">
				<span className="text-base">
					{Math.floor(coin.price).toLocaleString()}
				</span>
				<span className="text-xs ml-1 text-gray-500">KRW</span>
			</div>
			<div className="flex-[1] p-3 text-end">
				<span className="text-base font-bold">
					{Math.floor(evaluationPerPrice).toLocaleString() || 0}
				</span>
				<span className="text-xs ml-1 text-gray-500">KRW</span>
			</div>
			<div className="flex-[1] p-3">
				<div className="flex flex-col text-end mr-12">
					<div className="">
						<span className={`text-base ${colorClasses[change]}`}>
							{roundedProfitRate === 0
								? 0
								: (Math.round(profitRate * 1000) / 1000).toLocaleString()}
						</span>
						<span className="text-xs ml-1 text-gray-500">%</span>
					</div>
					<div className="">
						<span className={`text-base ${colorClasses[change]}`}>
							{roundedProfitRate === 0
								? 0
								: Math.floor(profitPrice).toLocaleString()}
						</span>
						<span className="text-xs ml-1 text-gray-500">KRW</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default BalanceCoin;
