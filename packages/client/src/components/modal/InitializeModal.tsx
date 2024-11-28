import Modal from '@/components/modal/Modal';
import WarningIcon from '@/asset/warning.svg?react';
import CloseIcon from '@/asset/close.svg?react';
import { useResetAccount } from '@/hooks/auth/useResetAccount';

type InitializeModalProps = {
	open: boolean;
	handleOpen: () => void;
};

function InitializeModal({ open, handleOpen }: InitializeModalProps) {
	const reset = useResetAccount();
	const handleInitialize = () => {
		reset.mutateAsync();
		handleOpen();
	};

	return (
		<Modal open={open} handleOpen={handleOpen}>
			<div className="p-6 flex flex-col items-center text-center">
				<CloseIcon
					className="w-8 h-8 absolute top-1 right-3 cursor-pointer"
					onClick={handleOpen}
				/>
				<h2 className="text-xl font-bold mb-4">계정 초기화 안내</h2>
				<div className="space-y-3 text-gray-700">
					<p className="font-medium">계정 정보가 모두 초기화돼요</p>
					<div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg">
						<div className="flex items-center gap-1 text-red-500 font-medium mb-2">
							<WarningIcon className="w-6" />
							<span className="text-lg">초기화되는 항목</span>
						</div>
						<ul className="space-y-2 text-sm">
							<li>계좌의 모든 잔액이 초기화돼요</li>
							<li>구매한 모든 코인이 초기화돼요</li>
							<li>거래 내역이 모두 삭제돼요</li>
							<li>초기화된 정보는 복구가 불가능해요</li>
						</ul>
					</div>
					<p className="text-sm text-red-500 font-medium">
						정말 계정을 초기화하시겠어요?
					</p>
				</div>
				<div className="flex gap-3 mt-6">
					<button
						className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
						onClick={handleInitialize}
					>
						초기화하기
					</button>
				</div>
			</div>
		</Modal>
	);
}

export default InitializeModal;
