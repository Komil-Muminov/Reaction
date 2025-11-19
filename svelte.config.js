import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/vite-plugin-svelte').Config} */
const config = {
	preprocess: vitePreprocess()
};

export default config;
