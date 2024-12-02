function RankingTableHeader() {
	return (
		<thead>
			<tr className="border-b border-solid font-semibold border-gray-400 ">
				<th className="p-2 text-left w-16">순위</th>
				<th className="p-2 text-left w-16">사용자</th>
				<th className="p-2 text-right w-fit">총 자산</th>
				<th className="p-2 text-right w-fit">투자 비율</th>
				<th className="p-2 text-right w-fit">총 손익</th>
				<th className="p-2 text-right w-fit">수익률</th>
			</tr>
		</thead>
	);
}

export default RankingTableHeader;
