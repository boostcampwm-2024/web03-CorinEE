import Modal from '@/components/modal/Modal';
import { useAuth } from '@/hooks/auth/useAuth';
import WarningIcon from '@/asset/warning.svg?react';
import CloseIcon from '@/asset/close.svg?react';

type GuestLoginModalProps = {
	open: boolean;
	handleOpen: () => void;
};

function GuestLoginModal({ open, handleOpen }: GuestLoginModalProps) {
	const { guestLogin } = useAuth();

	const handleLogin = () => {
		guestLogin.mutateAsync();
		handleOpen();
	};

	return (
		<Modal open={open} handleOpen={handleOpen}>
			<div className="p-6 flex flex-col items-center text-center">
				<CloseIcon
					className="w-8 h-8 absolute top-1 right-3 cursor-pointer"
					onClick={handleOpen}
				/>
				<h2 className="text-xl font-bold mb-4">체험용 계정 안내</h2>
				<div className="space-y-3 text-gray-700">
					<p className="font-medium">체험을 위한 임시 계정이에요</p>
					<div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg">
						<div className="flex items-center gap-1 text-red-500 font-medium mb-2">
							<WarningIcon className="w-6" />
							<span className="text-lg">주의사항</span>
						</div>
						<ul className="space-y-2 text-sm">
							<li>계정은 생성 후 24시간이 지나면 자동으로 만료돼요</li>
							<li>로그아웃을 하시면 모든 계정 정보가 즉시 삭제돼요</li>
							<li>삭제된 계정 정보는 복구가 불가능해요</li>
						</ul>
					</div>
					<p className="text-sm text-gray-500">
						계속 진행하시려면 아래 버튼을 눌러주세요
					</p>
				</div>
				<button
					className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
					onClick={handleLogin}
				>
					확인했어요
				</button>
			</div>
		</Modal>
	);
}

export default GuestLoginModal;
