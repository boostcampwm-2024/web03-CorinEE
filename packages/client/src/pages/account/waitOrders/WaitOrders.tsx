import { useMyWaitOrders } from '@/hooks/useMyWaitOrders';
import WaitOrderInfo from '@/pages/account/waitOrders/WaitOrderInfo';

function WaitOrders() {
	const waitOrders = useMyWaitOrders();

	return (
		<>
			<div className=" w-full mt-5">
				<div className="flex text-center text-sm bg-gray-100  border-b border-solid border-gray-300 py-2">
					<div className="w-[20%]">시간</div>
					<div className="w-[10%]">마켓명</div>
					<div className="w-[10%]">거래종류</div>
					<div className="w-[10%]">주문가격</div>
					<div className="w-[20%]">주문수량</div>
					<div className="w-[20%]">미체결량</div>
					<div className="w-[10%]">주문취소</div>
				</div>

				{waitOrders.reverse().map((waitOrder) => (
					<WaitOrderInfo key={waitOrder.tradeId} {...waitOrder} />
				))}
			</div>
		</>
	);
}

export default WaitOrders;
