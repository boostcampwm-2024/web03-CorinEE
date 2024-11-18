export const calculateTotalPrice = (price: string, quantity: string) => {
	const numPrice = parseFloat(price) || 0;
	const numQuantity = parseFloat(quantity) || 0;
	return Math.floor(numPrice * numQuantity);
};
