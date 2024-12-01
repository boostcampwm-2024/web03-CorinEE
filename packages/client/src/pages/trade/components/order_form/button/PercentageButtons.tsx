import { useMarketParams } from '@/hooks/market/useMarketParams';
import { usePercentageBuy } from '@/hooks/trade/usePercentageBuy';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';

interface PercentageButtonsProps {
	price: string;
	setQuantity: Dispatch<SetStateAction<string>>;
	askType: 'bid' | 'ask';
}

const PERCENTAGE_OPTIONS = [
	{ label: '10%', value: 10 },
	{ label: '25%', value: 25 },
	{ label: '50%', value: 50 },
	{ label: '최대', value: 100 },
] as const;

function PercentageButtons({
	price,
	setQuantity,
	askType,
}: PercentageButtonsProps) {
	const { code } = useMarketParams();
	const [percent, setPercent] = useState<number>();

	const { data, refetch } = usePercentageBuy({
		askType,
		moneyType: askType === 'bid' ? 'availableKRW' : code,
		percent,
	});

	useEffect(() => {
		if (data && price) {
			const calculatedQuantity = (data / Number(price)).toFixed(8);
			if (askType === 'bid') setQuantity(calculatedQuantity);
			else setQuantity(data.toFixed(8));
		}
	}, [data, price, setQuantity]);

	const handlePercentClick = (value: number) => {
		setPercent(value);
		refetch();
	};

	return (
		<div className="grid grid-cols-4 gap-2">
			{PERCENTAGE_OPTIONS.map(({ label, value }) => (
				<button
					key={label}
					type="button"
					onClick={() => handlePercentClick(value)}
					className="px-2 py-1.5 border border-solid border-gray-400 rounded-md 
            hover:bg-gray-200 transition-colors duration-200"
				>
					{label}
				</button>
			))}
		</div>
	);
}

export default PercentageButtons;
