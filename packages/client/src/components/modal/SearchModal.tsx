import SearchIcon from '@/asset/search.svg?react';
import Modal from '@/components/modal/Modal';
import { useSearchMarket } from '@/hooks/market/useSearchMarket';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useCallback } from 'react';
type SearchModalProps = {
	open: boolean;
	handleOpen: () => void;
};

function SearchModal({ open, handleOpen }: SearchModalProps) {
	const [value, setValue] = useState<string>('');
	const { data, isLoading, refetch } = useSearchMarket(value);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const searchValue = e.target.value;
		setValue(searchValue);
		debounceSearch(searchValue);
	};

	const debounceSearch = useCallback(
		debounce((searchValue: string) => {
			if (searchValue.trim() !== '') {
				refetch();
			}
		}, 500),
		[],
	);

	return (
		<Modal open={open} handleOpen={handleOpen}>
			<div className="h-64 p-3">
				<div className="flex items-center  gap-2 bg-blue-gray-50 py-1 px-3 rounded-xl text-center">
					<SearchIcon className="w-4 h-4" />
					<input
						className="w-full bg-transparent outline-none placeholder:text-gray-500"
						placeholder="검색어를 입력해주세요"
						value={value}
						onChange={handleChange}
					/>
				</div>
			</div>
		</Modal>
	);
}

export default SearchModal;
