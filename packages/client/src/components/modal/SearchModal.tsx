import SearchIcon from '@/asset/search.svg?react';
import Modal from '@/components/modal/Modal';
import { useSearchMarket } from '@/hooks/market/useSearchMarket';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { useCallback } from 'react';
import InputSkeleton from '../skeleton/InputSkeleton';
import { useMarketTop20 } from '@/hooks/market/useMarketTop20';
import SearchCoin from '../header/search/SearchCoin';
import { useCurrentTime } from '@/hooks/useCurrentTIme';

type SearchModalProps = {
	open: boolean;
	handleOpen: () => void;
};

function SearchModal({ open, handleOpen }: SearchModalProps) {
	const [value, setValue] = useState<string>('');
	const { data, isLoading, refetch } = useSearchMarket(value);
	const [isTyping, setIsTyping] = useState<boolean>(false);
	const { data: marketTop } = useMarketTop20();
	const currentTime = useCurrentTime();
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const searchValue = e.target.value;
		setValue(searchValue);
		debounceSearch(searchValue);
		setIsTyping(true);
	};

	const debounceSearch = useCallback(
		debounce((searchValue: string) => {
			if (searchValue.trim() !== '' || searchValue) {
				refetch();
			}
			setIsTyping(false);
		}, 500),
		[refetch],
	);

	useEffect(() => {
		setValue('');
		setIsTyping(false);
		return () => {
			debounceSearch.cancel();
		};
	}, [open]);

	return (
		<Modal open={open} handleOpen={handleOpen}>
			<div className="h-[450px] p-5 overflow-y-auto">
				<div className="flex items-center  gap-2 bg-blue-gray-50 py-1 px-3 rounded-xl text-center mb-3">
					<SearchIcon className="w-4 h-4" />
					<input
						className="w-full bg-transparent outline-none placeholder:text-gray-500"
						placeholder="검색어를 입력해주세요"
						value={value}
						onChange={handleChange}
					/>
				</div>

				{isTyping || isLoading ? (
					<InputSkeleton />
				) : data?.length ? (
					<div className="h-full">
						{data.map((market) => (
							<SearchCoin
								key={market.market}
								handleOpen={handleOpen}
								market={market}
							/>
						))}
					</div>
				) : value.trim() !== '' ? (
					<div className="text-center">검색 결과가 존재하지 않아요</div>
				) : (
					<div>
						<div className="flex justify-between text-black font-semibold border-b border-solid border-gray-200">
							<span>실시간</span>
							<span className="text-sm text-gray-400">
								오늘 {currentTime} 기준
							</span>
						</div>
						{marketTop?.map((market, index) => (
							<div
								key={market.market}
								className="flex items-center font-semibold hover:bg-gray-50"
							>
								<div className="w-5 mr-1 text-blue-700">{index + 1}</div>
								<SearchCoin handleOpen={handleOpen} market={market} />
							</div>
						))}
					</div>
				)}
			</div>
		</Modal>
	);
}

export default SearchModal;
