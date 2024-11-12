import { useState } from 'react';
import NotLogin from '@/components/NotLogin';

function OrderWaitForm() {
	const [isLogin] = useState(false);
	if (!isLogin) return <NotLogin size="md" />;
	return <div>order wait</div>;
}

export default OrderWaitForm;
