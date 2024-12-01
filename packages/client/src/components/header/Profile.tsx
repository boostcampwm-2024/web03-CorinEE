import UserIcon from '@/asset/user.svg?react';
import { useMyAccount } from '@/hooks/auth/useMyAccount';
import { useMyProfile } from '@/hooks/auth/useMyProfile';
import { formatUserName } from '@/utility/format/formatUserName';
import React from 'react';
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type ProfileProps = {
	openProfile: boolean;
	setOpenProfile: React.Dispatch<React.SetStateAction<boolean>>;
};

function Profile({ openProfile, setOpenProfile }: ProfileProps) {
	const { data } = useMyProfile();
	const { data: myAccount } = useMyAccount();
	const navigate = useNavigate();
	const profileRef = useRef<HTMLDivElement>(null);

	const handleNavigate = () => {
		navigate('/account/balance');
		setOpenProfile(false);
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				profileRef.current &&
				!profileRef.current.contains(event.target as Node)
			) {
				setOpenProfile(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [setOpenProfile]);

	if (!openProfile) return;
	return (
		<div
			ref={profileRef}
			className="absolute w-60 h-52 bg-white text-black top-10 right-3 z-50 shadow-2xl rounded-lg"
		>
			<div className="flex flex-col items-center justify-center">
				<UserIcon className="w-16 fill-blue-300 text-white" />
				<div className="font-semibold w-48 text-center">
					{formatUserName(data.userName)} 님 안녕하세요
				</div>

				<div className="w-full border-t pt-2 border-solid border-gray-200">
					<div className="w-48 m-auto mt-5 text-sm space-y-2">
						<div className="flex justify-between">
							<span className="text-gray-600">보유 현금</span>
							<span className="font-medium">
								{Math.floor(myAccount.availableKRW).toLocaleString()}원
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">보유 코인</span>
							<span className="font-medium">{myAccount.coins.length}개</span>
						</div>
						<div>
							<span
								onClick={handleNavigate}
								className="cursor-pointer text-sm text-blue-500 hover:underline"
							>
								내 계좌로 가기
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
