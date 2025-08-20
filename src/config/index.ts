import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();

const envSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	PORT: z.coerce.number().int().positive().default(8000),
	CORS_ORIGIN: z.string().url().default('http://localhost:5173'),
	LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
	DATABASE_URL: z.url().regex(/^postgresql:\/\//, {
		message: 'DATABASE_URL must be a PostgreSQL connection string'
	})
	// JWT secrets (preparing for auth)
	// JWT_ACCESS_SECRET: z.string().min(32),
	// JWT_REFRESH_SECRET: z.string().min(32),
	// JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
	// JWT_REFRESH_EXPIRES_IN: z.string().default('7d')
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
	console.error('❌ Invalid environment variables:');
	console.error(z.flattenError(env.error));
	process.exit(1);
}

// const config = {
// 	NODE_ENV: process.env.NODE_ENV || 'development',
// 	PORT: parseInt(process.env.PORT || '8000', 10),
// 	CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
// 	LOG_LEVEL: process.env.LOG_LEVEL || 'info',
// 	DATABASE_URL:
// 		process.env.DATABASE_URL ||
// 		'postgresql://uName:uPassowrd@localhost:5432/dbName?schema=public'
// };

const config = env.data;

export default config;
