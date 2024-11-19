import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@material-tailwind/react';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import './index.css';
import App from '@/App';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
	<ThemeProvider>
		<CookiesProvider>
			<BrowserRouter>
				<App />
				<ToastContainer />
			</BrowserRouter>
		</CookiesProvider>
	</ThemeProvider>,
);
