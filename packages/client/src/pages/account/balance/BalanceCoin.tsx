import { Change } from "@/types/ticker";
import colorClasses from '@/constants/priceColor';

function BalanceCoin() {

  const change: Change = 'FALL';

	return (
		<div className="flex border-b border-solid border-gray-300">
			<div className="flex-[1]  pt-3 px-3">
				<div className="flex items-center gap-3">
					<img
						className="w-7 h-7"
						src={`https://static.upbit.com/logos/XRP.png`}
					/>
					<div className="flex flex-col">
						<p className="font-semibold">리플</p>
						<p className="text-gray-700 text-xs">XRP</p>
					</div>
				</div>
			</div>
			<div className="flex-[1] p-3 text-end">
				<span className="text-base ">4.60687960</span>
				<span className="text-xs ml-1 text-gray-500">XRP</span>
			</div>
			<div className="flex-[1] p-3 text-end">
				<span className="text-base">542</span>
				<span className="text-xs ml-1 text-gray-500">KRW</span>
			</div>
			<div className="flex-[1] p-3 text-end">
				<span className="text-base">1,628</span>
				<span className="text-xs ml-1 text-gray-500">KRW</span>
			</div>
			<div className="flex-[1] p-3 text-end">
				<span className="text-base font-bold">7,500</span>
				<span className="text-xs ml-1 text-gray-500">KRW</span>
			</div>
			<div className="flex-[1] p-3">
				<div className="flex flex-col text-end mr-12">
					<div className="">
						<span className={`text-base ${colorClasses[change]}`}>-2.83</span>
						<span className="text-xs ml-1 text-gray-500">%</span>
					</div>
					<div className="">
						<span className={`text-base ${colorClasses[change]}`}>-212</span>
						<span className="text-xs ml-1 text-gray-500">KRW</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default BalanceCoin;
