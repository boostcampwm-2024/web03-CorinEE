import { CandlePeriod } from '@/types/chart';

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
