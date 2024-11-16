import NotLogin from '@/components/NotLogin';
import { useAuthStore } from '@/store/authStore';

function Interest() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

	if (!isAuthenticated) return <NotLogin size="sm" />;
}

export default Interest;
