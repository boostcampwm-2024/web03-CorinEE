import { toast, ToastOptions, Zoom } from 'react-toastify';
export function useToast() {
	const defaultOptions: ToastOptions = {
		position: 'top-center',
		autoClose: 1500,
		pauseOnHover: false,
		hideProgressBar: true,
		transition: Zoom,
		style: {
			maxWidth: 'fit-content',
			minWidth: '300px',
			whiteSpace: 'nowrap',
			display: 'inline-flex',
			margin: '0 auto',
		},
	};

	const showToast = {
		success: (message: string, options?: ToastOptions) => {
			toast.success(message, { ...defaultOptions, ...options });
		},
		error: (message: string, options?: ToastOptions) => {
			toast.error(message, { ...defaultOptions, ...options });
		},
		info: (message: string, options?: ToastOptions) => {
			toast.info(message, { ...defaultOptions, ...options });
		},
		warning: (message: string, options?: ToastOptions) => {
			toast.warning(message, { ...defaultOptions, ...options });
		},
	};

	return showToast;
}
