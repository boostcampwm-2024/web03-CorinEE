import { Navbar } from '@material-tailwind/react';
import { Link } from 'react-router-dom';
import logoImage from '@asset/logo/corineeLogo.png';
import Navigation from '@/components/header/Navigation';
import AuthSection from '@/components/header/AuthSection';
import SearchBar from '@/components/header/search/SearchBar';
import { Suspense } from 'react';

const Header = () => {
	const Logo = () => (
		<Link to="/" className="flex gap-2 items-center">
			<img className="w-12 h-12" src={logoImage} alt="Corinee Logo" />
			<h1 className="text-black text-xl font-semibold">Corinee</h1>
		</Link>
	);

	return (
		<>
			<Navbar
				fullWidth={true}
				className="w-full flex justify-between items-center sticky top-0 z-10 min-w-[1100px]"
				shadow={false}
			>
				<Logo />
				<div className="flex gap-4 items-center">
					<Navigation />
					<Suspense>
						<SearchBar />
					</Suspense>
				</div>
				<AuthSection />
			</Navbar>
		</>
	);
};

export default Header;
