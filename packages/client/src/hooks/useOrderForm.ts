import { useState, useEffect } from 'react';
import { useTrade } from '@/hooks/useTrade';
import { Market } from '@/types/market';
import { FormEvent } from 'react';
import { useMarketParams } from '@/hooks/market/useMarketParams';
import { useToast } from '@/hooks/useToast';
type UserOrderForm = {
	currentPrice: number;
	askType: 'bid' | 'ask';
	selectPrice: number | null;
};

export function useOrderForm({
	currentPrice,
	askType,
	selectPrice,
}: UserOrderForm) {
	const toast = useToast();
	const [price, setPrice] = useState<string>('');
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

		if (Number(quantity) * Number(price) < 5000) {
			toast.error('최소 주문 금액은 5000원 입니다!');
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

	useEffect(() => {
		if (!selectPrice) {
			setPrice(String(currentPrice));
			return;
		}
		setPrice(String(selectPrice));
	}, [selectPrice]);

	return {
		price,
		setPrice,
		quantity,
		setQuantity,
		quantityErrorMessage,
		handleSubmit,
	};
}
