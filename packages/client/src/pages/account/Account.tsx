import NotLogin from '@/components/NotLogin';
import AccountContent from '@/pages/account/AccoutContent';
import { useAuthStore } from '@/store/authStore';
import { Suspense } from 'react';

function Account() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	if (!isAuthenticated) return <NotLogin size="lg" />;

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AccountContent />
		</Suspense>
	);
}

export default Account;
