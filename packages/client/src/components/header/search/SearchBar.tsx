import SearchIcon from '@/asset/search.svg?react';
import SearchModal from '@/components/modal/SearchModal';
import { useModal } from '@/hooks/ui/useModal';

function SearchBar() {
	const { open, handleOpen } = useModal();
	return (
		<>
			<div className="flex items-center gap-2 bg-blue-gray-50 py-1 px-4 w-48 rounded-xl text-gray-500 text-center">
				<SearchIcon className="w-4 h-4" />
				<button onClick={handleOpen}>코인을 검색하세요</button>
			</div>
			<SearchModal open={open} handleOpen={handleOpen} />
		</>
	);
}

export default SearchBar;
