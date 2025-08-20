import dotenv from 'dotenv';
dotenv.config();

const config = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	PORT: parseInt(process.env.PORT || '8000', 10),
	CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
	LOG_LEVEL: process.env.LOG_LEVEL || 'info',
	DATABASE_URL:
		process.env.DATABASE_URL ||
		'postgresql://uName:uPassowrd@localhost:5432/dbName?schema=public'
};

export default config;
