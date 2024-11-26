import { Option } from '@/types/history';

type HistoryOptionProps = {
	option: Option;
	handleOption: (option: Option) => void;
};

function HistoryOption({ option, handleOption }: HistoryOptionProps) {
	return (
		<div className="flex flex-col">
			<div className="pt-6 pb-2">
				<span>종류</span>
			</div>
			<div className="flex text-gray-700 cursor-pointer text-center">
				<div
					className={`py-3 px-4 w-20  border-solid border-gray-400
					${
						option === 'TOTAL'
							? 'border-2 border-blue-700  text-blue-800'
							: option === 'BUY'
								? 'border-y border-l'
								: 'border'
					}`}
					onClick={() => {
						handleOption('TOTAL');
					}}
				>
					전체
				</div>
				<div
					className={`py-3 px-4 w-20  border-solid border-gray-400
					${
						option === 'BUY'
							? 'border-2 border-blue-700  text-blue-800'
							: option === 'SELL'
								? 'border-y'
								: 'border-y border-r'
					}`}
					onClick={() => {
						handleOption('BUY');
					}}
				>
					매수
				</div>
				<div
					className={`py-3 px-4 w-20  border-solid border-gray-400
					${option === 'SELL' ? 'border-2 border-blue-700  text-blue-800' : 'border-y border-r'}`}
					onClick={() => {
						handleOption('SELL');
					}}
				>
					매도
				</div>
			</div>
		</div>
	);
}

export default HistoryOption;
