import {
	ApiErrorBoundary,
	DefaultErrorFallback,
} from '@/components/error/ApiErrorBoundary';
import CoinView from '@/pages/home/components/CoinView';
import { Suspense } from 'react';

function Home() {
	return (
		<ApiErrorBoundary
			fallback={(error) => <DefaultErrorFallback error={error.error} />}
		>
			<Suspense>
				<CoinView />
			</Suspense>
		</ApiErrorBoundary>
	);
}

export default Home;
