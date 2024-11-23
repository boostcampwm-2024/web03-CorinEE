import React, { Component, ErrorInfo, ReactNode } from 'react';
interface Props {
	children: ReactNode;
	fallback: React.ComponentType<{ error: Error }>;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ApiErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
		};
	}

	static getDerivedStateFromError(error: Error): State {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, errorInfo);
	}

	render() {
		const { hasError, error } = this.state;
		const { children, fallback: Fallback } = this.props;

		if (hasError && error) {
			return <Fallback error={error} />;
		}

		return children;
	}
}

export const DefaultErrorFallback = ({ error }: { error: Error }) => {
	return (
		<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
			<h2 className="text-lg font-semibold text-red-800">
				에러가 발생했습니다
			</h2>
			<p className="mt-2 text-sm text-red-600">{error.message}</p>
		</div>
	);
};
