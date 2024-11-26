import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setCookie } from '@/utility/storage/cookies';
import { useAuthStore } from '@/store/authStore';

function Redirect() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const checkAuth = useAuthStore((state) => state.checkAuth);

	useEffect(() => {
		const access_token = searchParams.get('access_token');
		const refresh_token = searchParams.get('refresh_token');

		if (access_token && refresh_token) {
			localStorage.setItem('access_token', access_token);

			setCookie('refresh_token', refresh_token);
			checkAuth();
			navigate('/');
		}
	}, [searchParams, navigate]);

	return <div>Loading...</div>;
}

export default Redirect;
