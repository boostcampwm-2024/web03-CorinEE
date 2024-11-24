import { formatData } from '@/utility/format/formatSSEData';
import CoinInfo from '@/pages/trade/components/trade_header/CoinInfo';
import CoinStats from '@/pages/trade/components/trade_header/CoinStats';
import { SSEDataType } from '@/types/ticker';

type TradeHeaderProps = {
	market: string;
	sseData: SSEDataType;
};

function TradeHeader({ market, sseData }: TradeHeaderProps) {
	if (!sseData[market]) return; // 임시 방편 처리
	const formatter = formatData('KRW');

	const code = sseData[market].code;
	const trade_price = sseData[market].trade_price.toLocaleString();
	const change = sseData[market].change;
	const change_rate = formatter.formatChangeRate(
		sseData[market].signed_change_rate,
		change,
	);
	const change_price = formatter.formatSignedChangePrice(
		sseData[market].signed_change_price,
		change,
	);
	const acc_trade_price_24h = Math.ceil(
		sseData[market].acc_trade_price_24h,
	).toLocaleString();

	const high_price = sseData[market].high_price.toLocaleString();
	const low_price = sseData[market].low_price.toLocaleString();
	const korean_name = sseData[market].korean_name;
	const image_url = sseData[market].image_url;

	return (
		<div className="w-full flex justify-between mb-3 min-w-[1300px]">
			<CoinInfo
				korean_name={korean_name}
				code={code}
				change={change}
				trade_price={trade_price}
				change_price={change_price}
				change_rate={change_rate}
				image_url={image_url}
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
