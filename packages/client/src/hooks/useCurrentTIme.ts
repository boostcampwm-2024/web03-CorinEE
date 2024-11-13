import { useEffect, useState } from "react";

export function useCurrentTime() {
	const [currentTime, setCurrentTime] = useState('');

	useEffect(() => {
		const updateCurrentTime = () => {
			const now = new Date();

			setCurrentTime(
				now.toLocaleTimeString('ko-KR', {
					hour: '2-digit',
					minute: '2-digit',
					hour12: false, // 24시간 형식으로 설정
				}),
			);
		};

		// 초기 시간 설정 및 1분마다 갱신
		updateCurrentTime();
		const timer = setInterval(updateCurrentTime, 60000);

		return () => clearInterval(timer);
	}, []);

	return currentTime;
}