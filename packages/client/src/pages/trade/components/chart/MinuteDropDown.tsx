import { useState } from 'react';
import { CandlePeriod } from '@/types/chart';
import { DropDown } from '@/constants/chartSelector';
import ArrowDown from '@asset/arrowDown.svg?react';

type MinuteDropDown = {
	active: boolean;
	handleActivePeriod: (period: CandlePeriod, minute?: number) => void;
};

function MinuteDropDown({ active, handleActivePeriod }: MinuteDropDown) {
	const [open, setOpen] = useState(false);
	const [minute, setMinute] = useState(DropDown[2].id);
	return (
		<div className="relative">
			<div
				className={`text-gray-900 py-1 rounded-md ${active ? 'bg-gray-300' : null} cursor-pointer hover:bg-gray-200`}
				onClick={() => {
					handleActivePeriod('minutes', minute);
					if (active) setOpen(!open);
				}}
			>
				<span className="flex items-center gap-1">
					{minute}분 <ArrowDown />
				</span>
			</div>
			{open ? (
				<div className="flex flex-col absolute z-50 bg-white shadow-xl rounded-md top-8 -left-1">
					{DropDown.map(({ label, id }) => (
						<button
							key={id}
							className={`text-gray-900 py-1 w-24 rounded-md hover:bg-gray-200 text-left`}
							onClick={() => {
								setMinute(id);
								setOpen(!open);
								handleActivePeriod('minutes', id);
							}}
						>
							<span className="pl-2">{label}</span>
						</button>
					))}
				</div>
			) : null}
		</div>
	);
}

export default MinuteDropDown;
