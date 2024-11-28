import { OrderTabItem } from '@/constants/orderTabs';
import {
	ApiErrorBoundary,
	DefaultErrorFallback,
} from '@/components/error/ApiErrorBoundary';
import { Suspense } from 'react';

type OrderTabContentsType = {
	activeTabData: OrderTabItem;
};

function OrderTabContents({ activeTabData }: OrderTabContentsType) {
	return (
		<ApiErrorBoundary
			fallback={({ error }) => <DefaultErrorFallback error={error} />}
		>
			<Suspense>{activeTabData.component}</Suspense>
		</ApiErrorBoundary>
	);
}

export default OrderTabContents;
