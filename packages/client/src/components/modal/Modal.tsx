import { Dialog } from '@material-tailwind/react';
import { ReactElement } from 'react';

type ModalProps = {
	children: ReactElement;
	open: boolean;
	handleOpen: any;
};

function Modal({ children, open, handleOpen }: ModalProps) {
	return (
		<Dialog open={open} handler={handleOpen}>
			{children}
		</Dialog>
	);
}

export default Modal;
