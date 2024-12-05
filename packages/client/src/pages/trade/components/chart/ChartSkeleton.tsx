import Loading from '@/components/Loading';

function ChartSkeleton() {
	return (
		<div className="bg-gray-50 min-w-80 rounded-lg flex-[2] overflow-hidden">
			<Loading />
		</div>
	);
}

export default ChartSkeleton;
