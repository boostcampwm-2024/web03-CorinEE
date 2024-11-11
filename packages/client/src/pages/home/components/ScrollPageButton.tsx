type ScrollPageButtonProps = {
	pageNumber: number;
	onChangeScrollPage: (pageNumber: number) => void;
};

function ScrollPageButton({
	pageNumber,
	onChangeScrollPage,
}: ScrollPageButtonProps) {
	return (
		<ol
			onClick={() => {
				onChangeScrollPage(pageNumber);
			}}
		>
			<button>{pageNumber}</button>
		</ol>
	);
}

export default ScrollPageButton;
