import NotLogin from '@/components/NotLogin';
import { useAuthStore } from '@/store/authStore';
import { ComponentType } from 'react';

type SizeType = 'sm' | 'md' | 'lg';

type WithAuthProps<P> = {
	WrappedComponent: ComponentType<P>;
	size?: SizeType;
};

function withAuthenticate<P extends object>({
	WrappedComponent,
	size = 'sm',
}: WithAuthProps<P>) {
	return function AuthenticatedComponent(props: P) {
		const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

		if (!isAuthenticated) return <NotLogin size={size} />;
		return <WrappedComponent {...props} />;
	};
}

export default withAuthenticate;
