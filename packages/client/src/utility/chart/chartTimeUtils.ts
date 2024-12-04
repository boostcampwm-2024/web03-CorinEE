import { CandlePeriod } from '@/types/chart';

export const getPeriodMs = (activePeriod: CandlePeriod, minute?: number) => {
	switch (activePeriod) {
		case 'minutes':
			return (minute || 1) * 60 * 1000;
		case 'days':
			return false;
		case 'weeks':
			return false;
		case 'months':
			return false;
		default:
			return false;
	}
};
