function SideDrawer({ openRight, closeDrawerRight }) {
	return (
		<div className="overflow-hidden ">
			<div
				className={`
            h-full
            bg-gray-100
            transition-all duration-300 ease-in-out
			border-l border-gray-400 border-solid
            ${openRight ? 'translate-x-0 w-64' : 'translate-x-full w-0'}
          `}
			></div>
		</div>
	);
}

export default SideDrawer;
