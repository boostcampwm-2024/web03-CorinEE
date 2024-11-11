type ScrollPageButtonProps = {
	pageNumber: number;
	currentScrollPage: number;
	onChangeScrollPage: (pageNumber: number) => void;
};

function ScrollPageButton({
	pageNumber,
	onChangeScrollPage,
	currentScrollPage,
}: ScrollPageButtonProps) {
	const isActive = pageNumber === currentScrollPage;

	return (
		<ol
			onClick={() => {
				onChangeScrollPage(pageNumber);
			}}
		>
			<button className={`w-7 hover:bg-blue-gray-100 rounded-full 
      ${isActive ? 'text-black bg-blue-gray-100' :'text-gray-600'}`}>
				{pageNumber}
			</button>
		</ol>
	);
}

export default ScrollPageButton;
