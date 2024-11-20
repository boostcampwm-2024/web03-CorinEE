type VolumeBarProps = {
	size: number;
	maxSize: number;
	color: string;
	volume_color: string;
};

function VolumeBar({ size, maxSize, color, volume_color }: VolumeBarProps) {
	return (
		<div className="relative">
			<div
				className={`absolute left-0 top-0 h-full ${volume_color} rounded-sm`}
				style={{
					width: `${(size / maxSize) * 100}%`,
				}}
			/>
			<span className={`relative text-xs text-left pl-2 ${color}`}>
				{size.toFixed(3)}
			</span>
		</div>
	);
}

export default VolumeBar;
