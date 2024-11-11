import { useState } from 'react';
import NotLogin from '@/pages/trade/components/order_form/NotLogin';

function OrderWaitForm() {
	const [isLogin] = useState(false);
	if (!isLogin) return <NotLogin />;
	return <div>order wait</div>;
}

export default OrderWaitForm;
