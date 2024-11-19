import BalanceChart from '@/pages/account/balance/BalanceChart';
import BalanceCoin from '@/pages/account/balance/BalanceCoin';
import BalanceTable from '@/pages/account/balance/BalanceTable';

function Balance() {
	return (
		<div className="flex flex-col">
			<div className="flex p-3">
				<BalanceTable />
				<BalanceChart />
			</div>

			<div className=" w-full border-y border-solid border-gray-300 p-3">
				<p className="text-black font-medium">보유자산 목록</p>
			</div>

			<div className=" w-ful">
				<div className="flex text-center text-sm bg-gray-100  border-b border-solid border-gray-300">
					<div className="flex-[1]">보유자산</div>
					<div className="flex-[1]">보유수량</div>
					<div className="flex-[1]">매수평균가</div>
					<div className="flex-[1]">매수금액</div>
					<div className="flex-[1]">평가금액</div>
					<div className="flex-[1]">손익</div>
				</div>
			</div>

			<BalanceCoin />
			<BalanceCoin />
		</div>
	);
}

export default Balance;
