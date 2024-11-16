import Redis from 'ioredis';

let redisInstance: Redis | null = null;

export const redisConfig = {
	host: process.env.REDIS_HOST || '127.0.0.1',
	port: Number(process.env.REDIS_PORT) || 6379,
	password: process.env.REDIS_PASSWORD || undefined,
	db: Number(process.env.REDIS_DB) || 0,
};

export default function getRedisClient(): Redis {
	if (!redisInstance) {
		redisInstance = new Redis(redisConfig);

		redisInstance.on('connect', () => {
			console.log('Redis 연결 성공!');
		});

		redisInstance.on('error', (error) => {
			console.error('Redis 연결 오류:', error);
		});
	}

	return redisInstance;
}
