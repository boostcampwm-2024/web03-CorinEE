import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default function getTypeOrmConfig(): TypeOrmModuleOptions {
	return {
		type: process.env.DB_TYPE as 'mysql',
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		entities: [__dirname + '/../**/*.entity.{js,ts}'],
		synchronize: Boolean(process.env.DB_SYNCHRONIZE),
		dropSchema: Boolean(process.env.DB_DROPSCHEMA),
	};
}

