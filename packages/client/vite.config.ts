import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			{ find: '@', replacement: path.resolve(__dirname, 'src') },
			{
				find: '@components',
				replacement: path.resolve(__dirname, 'src/components'),
			},
			{ find: '@api', replacement: path.resolve(__dirname, 'src/api') },
			{
				find: '@constants',
				replacement: path.resolve(__dirname, './src/constants'),
			},
			{ find: '@hooks', replacement: path.resolve(__dirname, 'src/hooks') },
			{ find: '@types', replacement: path.resolve(__dirname, 'src/types') },
			{
				find: '@utility',
				replacement: path.resolve(__dirname, '/src/utility'),
			},
			{ find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
		],
	},
});
