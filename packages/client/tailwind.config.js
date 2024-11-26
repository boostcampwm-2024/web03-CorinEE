const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/.vite/deps/@material-tailwind_react.js',
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Pretendard', 'sans-serif'],
			},
			animation: {
				infiniteScroll: 'infiniteScroll 500s linear infinite',
			},
			keyframes: {
				infiniteScroll: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-100%)' },
				},
			},
		},
	},
	plugins: [],
});
