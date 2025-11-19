/**
 * Environment variables configuration
 * Type-safe access to environment variables
 */

interface EnvConfig {
	apiUrl: string;
	isDev: boolean;
	isProd: boolean;
	isTest: boolean;
	environment: 'development' | 'production' | 'test';
}

const getEnv = (): EnvConfig => {
	const mode = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
	const apiUrl = process.env.VITE_API_URL || 'http://localhost:3000';

	return {
		apiUrl,
		isDev: mode === 'development',
		isProd: mode === 'production',
		isTest: mode === 'test',
		environment: mode
	};
};

export const env = getEnv();
