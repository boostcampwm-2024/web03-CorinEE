import { AccountHistory, Option, Period } from '@/types/history';

export function getCustomDateRange(period: Period) {
	const endDate = new Date();
	const startDate = new Date();

	switch (period) {
		case 'ONE_WEEK':
			startDate.setDate(endDate.getDate() - 7);
			break;
		case 'ONE_MONTH':
			startDate.setMonth(endDate.getMonth() - 1);
			break;
		case 'THREE_MONTH':
			startDate.setMonth(endDate.getMonth() - 3);
			break;
		case 'SIX_MONTH':
			startDate.setMonth(endDate.getMonth() - 6);
			break;
	}

	const formatDate = (date: Date): string => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return `${year}.${month}.${day}`;
	};

	return {
		startDate: formatDate(startDate),
		endDate: formatDate(endDate),
	};
}

export function formatDateTime(dateString: string) {
	const date = new Date(dateString);

	// 날짜 형식 (YYYY.MM.DD)
	const formatDate = () => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		return `${year}.${month}.${day}`;
	};

	// 시간 형식 (HH:MM)
	const formatTime = () => {
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');

		return `${hours}:${minutes}`;
	};

	return {
		date: formatDate(),
		time: formatTime(),
	};
}

// 날짜 필터 함수
export const filterByDate = (
	history: AccountHistory,
	dateRange: { startDate: Date; endDate: Date } | null,
) => {
	if (!dateRange) return true; // TOTAL인 경우
	const historyDate = new Date(history.createdAt);
	return historyDate >= dateRange.startDate && historyDate <= dateRange.endDate;
};

// 거래 타입 필터 함수
export const filterByTradeType = (history: AccountHistory, option: Option) => {
	if (option === 'TOTAL') return true;
	return history.tradeType === option.toLowerCase();
};

export const getDateRange = (period: Period) => {
  if (period === 'TOTAL') return null;

  const endDate = new Date();
  // endDate를 현재 날짜의 마지막 시간(23:59:59)으로 설정
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();
  // startDate를 해당 날짜의 시작 시간(00:00:00)으로 설정
  startDate.setHours(0, 0, 0, 0);

  switch (period) {
    case 'ONE_WEEK':
      startDate.setDate(endDate.getDate() - 7);
      break;
    case 'ONE_MONTH':
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case 'THREE_MONTH':
      startDate.setMonth(endDate.getMonth() - 3);
      break;
    case 'SIX_MONTH':
      startDate.setMonth(endDate.getMonth() - 6);
      break;
  }

  return { startDate, endDate };
};
