type RankingTableRowProps = {
	username: string;
	totalAsset: number;
	investmentRatio: number;
	totalProfitLoss: number;
	profitRate: number;
	index: number;
};

function RankingTableRow({
	username,
	totalAsset,
	investmentRatio,
	totalProfitLoss,
	profitRate,
	index,
}: RankingTableRowProps) {
	return (
		<tr key={username} className="border-b">
			<td
				className={`p-2 ${
					index === 0
						? 'text-red-600 font-bold'
						: index === 1
							? 'text-blue-600 font-bold'
							: index === 2
								? 'text-black font-bold'
								: 'text-gray-600'
				}`}
			>
				{index + 1}위
			</td>
			<td className="p-2">{username}</td>
			<td className="p-2 text-right">
				{totalAsset.toLocaleString(undefined, {
					maximumFractionDigits: 0,
				})}
				원
			</td>
			<td className="p-2 text-right">{investmentRatio.toFixed(1)}%</td>
			<td
				className={`p-2 text-right ${totalProfitLoss >= 0 ? 'text-red-600' : 'text-blue-600'}`}
			>
				{totalProfitLoss.toLocaleString(undefined, {
					maximumFractionDigits: 0,
				})}
				원
			</td>
			<td
				className={`p-2 text-right ${profitRate >= 0 ? 'text-red-600' : 'text-blue-600'}`}
			>
				{profitRate.toFixed(3)}%
			</td>
		</tr>
	);
}

export default RankingTableRow;
