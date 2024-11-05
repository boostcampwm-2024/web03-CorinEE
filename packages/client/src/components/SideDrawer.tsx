function SideDrawer({ openRight, closeDrawerRight }) {
	return (
		<div className="overflow-hidden">
			<div
				className={`
            h-screen
            bg-gray-100
            transition-all duration-300 ease-in-out
            ${openRight ? 'translate-x-0 w-64' : 'translate-x-full w-0'}
          `}
			>
				<button
					onClick={closeDrawerRight}
					className="m-4 px-4 py-2 bg-white rounded hover:bg-gray-100"
				>
					닫기
				</button>
			</div>
		</div>
	);
}

export default SideDrawer;
