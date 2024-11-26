import { CandlePeriod } from '@/types/chart';
import { Time } from 'lightweight-charts';

export const getPeriodMs = (activePeriod: CandlePeriod, minute?: number) => {
	switch (activePeriod) {
		case 'minutes':
			return (minute || 1) * 60 * 1000;
		case 'days':
			return 24 * 60 * 60 * 1000;
		case 'weeks':
			return 7 * 24 * 60 * 60 * 1000;
		case 'months':
			return 30 * 24 * 60 * 60 * 1000;
		default:
			return 60 * 1000;
	}
};

export const getCurrentCandleStartTime = (
	activePeriod: CandlePeriod,
	minute?: number,
) => {
	const now = new Date();
	const periodMs = getPeriodMs(activePeriod, minute);

	switch (activePeriod) {
		case 'minutes':
			return ((Math.floor(now.getTime() / periodMs) * periodMs) / 1000) as Time;

		case 'days': {
			const startOfDay = new Date(now);
			startOfDay.setUTCHours(0, 0, 0, 0);
			return (startOfDay.getTime() / 1000) as Time;
		}

		case 'weeks': {
			const startOfWeek = new Date(now);
			startOfWeek.setUTCHours(0, 0, 0, 0);
			const day = startOfWeek.getUTCDay();
			const diff = startOfWeek.getUTCDate() - day + (day === 0 ? -6 : 1);
			startOfWeek.setUTCDate(diff);
			return (startOfWeek.getTime() / 1000) as Time;
		}

		case 'months': {
			const startOfMonth = new Date(now);
			startOfMonth.setUTCHours(0, 0, 0, 0);
			startOfMonth.setUTCDate(1);
			return (startOfMonth.getTime() / 1000) as Time;
		}

		default:
			return ((Math.floor(now.getTime() / periodMs) * periodMs) / 1000) as Time;
	}
};
