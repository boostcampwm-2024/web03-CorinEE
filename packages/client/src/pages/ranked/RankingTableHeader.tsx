function RankingTableHeader() {
	return (
		<thead>
			<tr className="border-b border-solid font-semibold border-gray-400 ">
				<th className="p-2 text-left w-16">순위</th>
				<th className="p-2 text-left w-16">사용자</th>
				<th className="p-2 text-right w-fit">총 자산</th>
				<th className="p-2 text-right w-fit">현재 투자율</th>
				<th className="p-2 text-right w-fit">총 손익</th>
				<th className="p-2 text-right w-fit">
					수익률 <span className="text-sm font-normal text-gray-700">{'(초기 자본금 대비)'}</span>
				</th>
			</tr>
		</thead>
	);
}

export default RankingTableHeader;
