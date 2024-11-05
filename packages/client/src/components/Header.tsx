import { Navbar, Typography } from '@material-tailwind/react';

function Header() {
	return (
		<Navbar fullWidth={true} className="flex justify-end">
			<Typography
				as="a"
				href="#"
				className="mr-4 cursor-pointer py-1.5 font-medium text-red-300"
			>
				Material Tailwind
			</Typography>
			<p className="text-red-300">sdf</p>
		</Navbar>
	);
}

export default Header;
