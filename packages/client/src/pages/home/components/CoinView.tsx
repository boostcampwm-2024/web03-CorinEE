function CoinView() {
	return (
		<div>
			<h3 className="text-2xl font-bold text-gray-800">코인 리스트</h3>
			<div className="text-sm text-gray-700">실시간 코인 가격 확인</div>

			<ul className="flex gap-8 text-lg">
				<li>
					<button className="text-gray-800 px-3 bg-gray-100 rounded-md hover:bg-gray-300">
						원화
					</button>
				</li>
				<li>
					<button className="text-gray-800 px-3 bg-gray-100 rounded-md hover:bg-gray-300">
						BTC
					</button>
				</li>
				<li>
					<button className="text-gray-800 px-3 bg-gray-100 rounded-md hover:bg-gray-300">
						USDT
					</button>
				</li>
				<li>
					<button className="text-gray-800 px-3 bg-gray-100 rounded-md hover:bg-gray-300">
						관심
					</button>
				</li>
				<li>
					<button className="text-gray-800 px-3 bg-gray-100 rounded-md hover:bg-gray-300">
						보유
					</button>
				</li>
			</ul>
		</div>
	);
}

export default CoinView;
