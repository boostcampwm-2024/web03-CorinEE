import withAuthenticate from '@/components/hoc/withAuthenticate';
import AccountContent from '@/pages/account/AccoutContent';
import { Suspense } from 'react';

function Account() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<AccountContent />
		</Suspense>
	);
}

export default withAuthenticate({ WrappedComponent: Account, size: 'lg' });
