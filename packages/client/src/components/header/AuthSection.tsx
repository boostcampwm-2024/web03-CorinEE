import { useAuthStore } from '@/store/authStore';
import { useLocation } from 'react-router-dom';
import { Button } from '@material-tailwind/react';
import { useModal } from '@/hooks/ui/useModal';
import { useAuth } from '@/hooks/auth/useAuth';
import InitializeModal from '@/components/modal/InitializeModal';
import LoginButtons from '@/components/header/LoginButtons';
function AuthSection() {
	const { logout } = useAuth();
	const location = useLocation();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isAccountPage = location.pathname.startsWith('/account');

	const { open: initializeModalOpen, handleOpen: handleInitializeModal } =
		useModal();

	return (
		<div className="w-[200px] flex justify-end gap-2">
			{isAuthenticated ? (
				<>
					{isAccountPage && (
						<Button onClick={handleInitializeModal}>초기화</Button>
					)}
					<Button onClick={() => logout.mutateAsync()}>로그아웃</Button>
				</>
			) : (
				<LoginButtons />
			)}
			<InitializeModal
				open={initializeModalOpen}
				handleOpen={handleInitializeModal}
			/>
		</div>
	);
}

export default AuthSection;
