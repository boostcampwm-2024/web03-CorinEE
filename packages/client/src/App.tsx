import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Router from './Router';

function App() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				refetchOnMount: true,
				refetchOnReconnect: false,
			},
		},
	});
	return (
		<QueryClientProvider client={queryClient}>
			<Router />
		</QueryClientProvider>
	);
}

export default App;
