import { toast, ToastOptions } from 'react-toastify';
export function useToast() {
	const defaultOptions: ToastOptions = {
		position: 'top-center',
		autoClose: 1500,
		pauseOnHover: false,
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
