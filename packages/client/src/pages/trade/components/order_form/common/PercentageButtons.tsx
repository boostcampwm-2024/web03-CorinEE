import { usePercentageBuy } from '@/hooks/usePercentageBuy';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';

type PercentageButtonsProps = {
	price: string;
	setQuantity: Dispatch<SetStateAction<string>>;
};

function PercentageButtons({ price, setQuantity }: PercentageButtonsProps) {
	const [percent, setPercent] = useState<number>();
	const { data, refetch } = usePercentageBuy({
		moneyType: 'KRW',
		percent: percent,
	});

	const handlePercentClick = (text: string) => {
		let selectedPercent: number;
		if (text === '최대') {
			selectedPercent = 100;
		} else {
			selectedPercent = parseInt(text);
		}
		setPercent(selectedPercent);
		refetch();
	};

	useEffect(() => {
		if (data) {
			setQuantity((data / Number(price)).toFixed(8));
		}
	}, [data]);

	return (
		<div className="grid grid-cols-4 gap-2">
			{['10%', '25%', '50%', '최대'].map((text) => (
				<button
					onClick={() => handlePercentClick(text)}
					key={text}
					type="button"
					className="px-2 py-1.5 border border-solid border-gray-400 rounded-md hover:bg-gray-200"
				>
					{text}
				</button>
			))}
		</div>
	);
}

export default PercentageButtons;
