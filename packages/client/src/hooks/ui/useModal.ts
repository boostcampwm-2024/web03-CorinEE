import { useState } from 'react';

export function useModal() {
	const [open, setOpen] = useState<boolean>(false);
	const handleOpen = () => {
		setOpen(!open);
	};

	return { open, handleOpen };
}
