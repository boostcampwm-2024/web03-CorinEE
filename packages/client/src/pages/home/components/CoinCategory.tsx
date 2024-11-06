function CoinCategory({category}) {
	return (
		<li>
			<button className="text-gray-800 px-3 bg-gray-100 rounded-md hover:bg-gray-300">
				{category}
			</button>
		</li>
	);
}

export default CoinCategory;
