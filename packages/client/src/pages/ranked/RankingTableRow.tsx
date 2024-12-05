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
				className={`p-2 w-1/12 ${
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
			<td className="p-2 w-2/12">{username}</td>
			<td className="p-2 w-2/12 text-right">
				{totalAsset.toLocaleString(undefined, {
					maximumFractionDigits: 0,
				})}
				원
			</td>
			<td className="p-2 w-2/12 text-right">{investmentRatio.toFixed(1)}%</td>
			<td
				className={`p-2  w-3/12 text-right ${totalProfitLoss > 0 ? 'text-red-600' : totalProfitLoss < 0 ? 'text-blue-600' : ''}`}
			>
				{totalProfitLoss.toLocaleString(undefined, {
					maximumFractionDigits: 0,
				})}
				원
			</td>
			<td
				className={`p-2 text-right w-2/12 ${profitRate > 0 ? 'text-red-600' : profitRate < 0 ? 'text-blue-600' : ''}`}
			>
				{profitRate.toFixed(3)}%
			</td>
		</tr>
	);
}

export default RankingTableRow;
