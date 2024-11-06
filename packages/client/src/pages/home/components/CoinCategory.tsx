function CoinCategory({category ,activeCategory, handleCategory}) {
    const isActive = category === activeCategory;

	return (
		<li>
			<button className={`text-gray-800 px-3 ${isActive?"bg-gray-300": "bg-gray-100"} rounded-md hover:bg-gray-300`} onClick={()=>handleCategory(category)}>
				{category}
			</button>
		</li>
	);
}

export default CoinCategory;
