import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			{ find: '@', replacement: './src' },
			{ find: '@components', replacement: './src/components' },
			{ find: '@api', replacement: './src/api' },
			{ find: '@constants', replacement: './src/constants' },
			{ find: '@hooks', replacement: './src/hooks' },
			{ find: '@types', replacement: './src/types' },
			{ find: '@utility', replacement: './src/utility' },
			{ find: '@pages', replacement: './src/pages' },
		],
	},
});
