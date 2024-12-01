type RankingHeaderProps = {
	title: string;
	subtitle: string;
};

function RankingHeader({ title, subtitle }: RankingHeaderProps) {
	return (
		<div className="w-full mr-0">
			<h3 className="text-2xl font-bold text-gray-800">{title}</h3>
			<span className="mb-6 text-sm text-gray-700">{subtitle}</span>
		</div>
	);
}

export default RankingHeader;
