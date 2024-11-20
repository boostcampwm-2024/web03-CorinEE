import { useState, useEffect } from 'react';
import { useTrade } from '@/hooks/useTrade';
import { Market } from '@/types/market';
import { FormEvent } from 'react';
import { useMarketParams } from '@/hooks/market/useMarketParams';
type UserOrderForm = {
	currentPrice: number;
	askType: 'bid' | 'ask';
};

export function useOrderForm({ currentPrice, askType }: UserOrderForm) {
	const [price, setPrice] = useState(String(currentPrice));
	const [quantity, setQuantity] = useState<string>('');
	const [quantityErrorMessage, setQuantityErrorMessage] = useState<string>('');

	const tradeMutation = useTrade(askType);
	const { marketType, code } = useMarketParams();

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (quantity === '' || !quantity || !Number(quantity)) {
			setQuantityErrorMessage('수량을 입력해주세요');
			return;
		}

		const tradeData =
			askType === 'bid'
				? {
						askType: 'bid' as const,
						typeGiven: marketType as Market,
						typeReceived: code,
						receivedPrice: Number(price),
						receivedAmount: Number(quantity),
					}
				: {
						askType: 'ask' as const,
						typeGiven: code,
						typeReceived: marketType as Market,
						receivedPrice: Number(price),
						receivedAmount: Number(quantity),
					};

		tradeMutation.mutateAsync(tradeData);
		setQuantity('');
	};

	useEffect(() => {
		if (quantityErrorMessage) {
			const timer = setTimeout(() => {
				setQuantityErrorMessage('');
			}, 1500);

			return () => clearTimeout(timer);
		}
	}, [quantityErrorMessage]);

	return {
		price,
		setPrice,
		quantity,
		setQuantity,
		quantityErrorMessage,
		handleSubmit,
	};
}
