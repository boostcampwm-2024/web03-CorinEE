import { formatData } from '@/utility/formatData';
import CoinInfo from '@/pages/trade/components/trade_header/CoinInfo';
import CoinStats from '@/pages/trade/components/trade_header/CoinStats';
import { SocketDataType } from '@/types/ticker';

type TradeHeaderProps = {
	market: string;
	socketData: SocketDataType;
};

function TradeHeader({ market, socketData }: TradeHeaderProps) {
	const formatter = formatData('KRW');
	const code = socketData[market].code;
	const trade_price = socketData[market].trade_price.toLocaleString();
	const change = socketData[market].change;
	const change_rate = formatter.formatChangeRate(
		socketData[market].signed_change_rate,
		change,
	);
	const change_price = formatter.formatSignedChangePrice(
		socketData[market].signed_change_price,
		change,
	);
	const acc_trade_price_24h = Math.ceil(
		socketData[market].acc_trade_price_24h,
	).toLocaleString();

	const high_price = socketData[market].high_price.toLocaleString();
	const low_price = socketData[market].low_price.toLocaleString();

	return (
		<div className="w-full flex justify-between mb-3">
			<CoinInfo
				korean_name="비트코인"
				code={code}
				change={change}
				trade_price={trade_price}
				change_price={change_price}
				change_rate={change_rate}
			/>
			<CoinStats
				acc_trade_price_24h={acc_trade_price_24h}
				high_price={high_price}
				low_price={low_price}
			/>
		</div>
	);
}

export default TradeHeader;
