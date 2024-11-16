import NotLogin from '@/components/NotLogin';
import { useAuthStore } from '@/store/authStore';

function OrderWaitForm() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	if (!isAuthenticated) return <NotLogin size="md" />;
	return <div>order wait</div>;
}

export default OrderWaitForm;
