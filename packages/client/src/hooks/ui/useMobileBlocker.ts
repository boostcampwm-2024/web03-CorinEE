import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useMobileBlocker() {
	const navigate = useNavigate();
	const [isMobileView, setIsMobileView] = useState<boolean>(false);

	useEffect(() => {
		const checkMobile = () => {
			const userAgent = navigator.userAgent.toLowerCase();
			const isMobileDevice =
				/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
					userAgent,
				);
			const isMobileWidth = window.innerWidth <= 768; // 원하는 breakpoint 설정

			return isMobileDevice && isMobileWidth;
		};
		setIsMobileView(checkMobile());
		const handleResize = () => {
			setIsMobileView(checkMobile());
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [navigate]);

	return isMobileView;
}
