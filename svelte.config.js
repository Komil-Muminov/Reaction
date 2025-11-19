import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/vite-plugin-svelte').Config} */
const config = {
	preprocess: vitePreprocess(),
	// Keep legacy component API (new Component(...)) for now
	compilerOptions: {
		compatibility: {
			componentApi: 4
		}
	}
};

export default config;
