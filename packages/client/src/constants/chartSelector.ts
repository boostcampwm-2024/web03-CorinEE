import { CandlePeriod, CandleMinutes } from '@/types/chart';

export const PERIODS: { label: string; id: CandlePeriod }[] = [
	{ label: '분', id: 'minutes' },
	{
		label: '일',
		id: 'days',
	},
	{
		label: '주',
		id: 'weeks',
	},
	{
		label: '월',
		id: 'months',
	},
	{
		label: '년',
		id: 'years',
	},
];

export const DropDown: { label: string; id: CandleMinutes }[] = [
	{
		label: '1분',
		id: 1,
	},
	{
		label: '3분',
		id: 3,
	},
	{
		label: '5분',
		id: 5,
	},
	{
		label: '10분',
		id: 10,
	},
	{
		label: '15분',
		id: 15,
	},
	{
		label: '30분',
		id: 30,
	},
	{
		label: '60분',
		id: 60,
	},
];
