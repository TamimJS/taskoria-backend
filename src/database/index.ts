import config from '@/config';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient({
	log:
		config.NODE_ENV === 'development'
			? ['query', 'info', 'warn', 'error']
			: ['warn', 'error'],
	datasources: {
		db: {
			url: config.DATABASE_URL
		}
	}
});

// Connection health check
prisma
	.$connect()
	.then(() => console.log('✅ Database connected successfully'))
	.catch((err) => {
		console.error('❌ Database connection failed:', err);
		process.exit(1);
	});

export default prisma;
