import NotLogin from '@/components/NotLogin';
import { useAuthStore } from '@/store/authStore';
function MyInvestment() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	if (!isAuthenticated) return <NotLogin size="sm" />;
}

export default MyInvestment;
