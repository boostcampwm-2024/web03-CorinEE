import { useAuthStore } from '@/store/authStore';
import { useLocation } from 'react-router-dom';
import { Button } from '@material-tailwind/react';
import { useModal } from '@/hooks/ui/useModal';
import { useAuth } from '@/hooks/auth/useAuth';
import InitializeModal from '@/components/modal/InitializeModal';
import LoginButtons from '@/components/header/LoginButtons';
import UserIcon from '@/asset/user.svg?react';
import Profile from '@/components/header/Profile';
import { Suspense, useRef, useState } from 'react';
import {
	ApiErrorBoundary,
	DefaultErrorFallback,
} from '@/components/error/ApiErrorBoundary';
function AuthSection() {
	const { logout } = useAuth();
	const location = useLocation();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const isAccountPage = location.pathname.startsWith('/account');
	const profileLogoRef = useRef<HTMLDivElement>(null);

	const { open: initializeModalOpen, handleOpen: handleInitializeModal } =
		useModal();

	const [openProfile, setOpenProfile] = useState<boolean>(false);

	const handleProfileToggle = () => {
		setOpenProfile(!openProfile);
	};

	return (
		<div className="w-[230px] flex justify-end gap-2">
			{isAuthenticated ? (
				<div className="flex items-center gap-2">
					<div className="relative cursor-pointer" ref={profileLogoRef}>
						<UserIcon
							onClick={handleProfileToggle}
							className="w-11 h-11 fill-blue-300"
						/>
						<ApiErrorBoundary
							fallback={({ error }) => <DefaultErrorFallback error={error} />}
						>
							<Suspense>
								<Profile
									openProfile={openProfile}
									setOpenProfile={setOpenProfile}
									profileLogoRef={profileLogoRef}
								/>
							</Suspense>
						</ApiErrorBoundary>
					</div>
					{isAccountPage && (
						<Button onClick={handleInitializeModal}>초기화</Button>
					)}
					<Button onClick={() => logout.mutateAsync()}>로그아웃</Button>
				</div>
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
