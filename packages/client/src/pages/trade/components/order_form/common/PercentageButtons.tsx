function PercentageButtons() {
	return (
		<div className="grid grid-cols-4 gap-2">
			{['10%', '25%', '50%', '최대'].map((text) => (
				<button
					key={text}
					type="button"
					className="px-2 py-1.5 border border-solid border-gray-400 rounded-md hover:bg-gray-200"
				>
					{text}
				</button>
			))}
		</div>
	);
}

export default PercentageButtons;
