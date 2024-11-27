import { OrderTabItem } from '@/constants/orderTabs';
import {
	ApiErrorBoundary,
	DefaultErrorFallback,
} from '@/components/error/ApiErrorBoundary';
import { Suspense } from 'react';

type OrderTabContentsType = {
	activeTabData: OrderTabItem;
	isAuthenticated: boolean;
};

function OrderTabContents({
	activeTabData,
	isAuthenticated,
}: OrderTabContentsType) {
	if (!isAuthenticated) {
		return activeTabData.notLogin;
	}
	return (
		<ApiErrorBoundary
			fallback={({ error }) => <DefaultErrorFallback error={error} />}
		>
			<Suspense>{activeTabData.component}</Suspense>
		</ApiErrorBoundary>
	);
}

export default OrderTabContents;
