import { Typography } from '@material-tailwind/react';

function InputSkeleton() {
	const skeletonLines = Array.from({ length: 8 });

	return (
		<div className="flex flex-col gap-1 w-full h-full animate-pulse">
			<Typography
				as="div"
				variant="h1"
				className="mb-4 h-3 w-64 rounded-full bg-gray-300"
			>
				&nbsp;
			</Typography>
			{skeletonLines.map((_, index) => (
				<Typography
					key={index}
					as="div"
					variant="paragraph"
					className="mb-2 h-4 w-96 rounded-full bg-gray-300"
				>
					&nbsp;
				</Typography>
			))}
		</div>
	);
}

export default InputSkeleton;
