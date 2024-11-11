type ScrollPageButtonProps = {
	pageNumber: number;
	currentScrollPage: number;
	handleScrollPage: (pageNumber: number) => void;
};

function ScrollPageButton({
	pageNumber,
	handleScrollPage,
	currentScrollPage,
}: ScrollPageButtonProps) {
	const isActive = pageNumber === currentScrollPage;

	return (
		<ol
			onClick={() => {
				handleScrollPage(pageNumber);
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
