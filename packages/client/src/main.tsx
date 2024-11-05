import { createRoot } from 'react-dom/client';
import './index.css';
import App from '@/App';
import { ThemeProvider } from '@material-tailwind/react';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
	<ThemeProvider>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ThemeProvider>,
);
