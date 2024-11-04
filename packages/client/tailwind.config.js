const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./node_modules/.vite/deps/@material-tailwind_react.js',
	],
	theme: {
		extend: {},
	},
	plugins: [],
});
