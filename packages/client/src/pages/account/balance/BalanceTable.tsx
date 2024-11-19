import BalanceInfo from '@/pages/account/balance/BalanceInfo';

function BalanceTable() {
	return (
		<div className="flex p-4 flex-col w-3/5 border-r-2 border-gray-300 border-solid">
			<div className="flex h-20 gap-8 items-center">
				<BalanceInfo title="보유 KRW" amount={0} unit="KRW" primary={true} />
				<BalanceInfo
					title="총 보유자산"
					amount={14000}
					unit="KRW"
					primary={true}
				/>
			</div>
			<div className="border border-solid border-gray-300 my-3"></div>

			<div className="flex h-10 gap-8 items-center">
				<BalanceInfo
					title="총 매수"
					amount={14993}
					unit="KRW"
					primary={false}
				/>
				<BalanceInfo
					title="총평가손익"
					amount={-200}
					unit="KRW"
					primary={false}
				/>
			</div>
			<div className="flex h-10 gap-8 items-center">
				<BalanceInfo
					title="총 평가"
					amount={14793}
					unit="KRW"
					primary={false}
				/>
				<BalanceInfo
					title="총평가수익률"
					amount={-1.28}
					unit="%"
					primary={false}
				/>
			</div>
			<div className="flex h-10 gap-8 items-center">
				<BalanceInfo title="주문가능" amount={0} unit="KRW" primary={false} />
				<div className="flex-[1]"></div>
			</div>
		</div>
	);
}

export default BalanceTable;
