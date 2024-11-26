import { IChartApi, LogicalRange } from 'lightweight-charts';
import React from 'react';
import { throttle } from 'lodash';

export const handleResize = (
	chartRef: React.RefObject<HTMLDivElement>,
	chartInstanceRef: React.RefObject<IChartApi | null>,
) => {
	if (chartRef.current && chartInstanceRef.current) {
		const { width } =
			chartRef.current.parentElement?.getBoundingClientRect() || { width: 0 };
		chartInstanceRef.current.applyOptions({
			width: width,
		});
	}
};

export const handleScroll = (
	fetchNextPage: () => Promise<unknown>,
	options = { threshold: 45, delay: 300 },
) => {
	return throttle(
		async (logicalRange: LogicalRange | null) => {
			if (!logicalRange || logicalRange.from >= options.threshold) return;
			if (logicalRange.from < options.threshold) {
				await fetchNextPage();
			}
		},
		options.delay,
		{ leading: true },
	);
};
