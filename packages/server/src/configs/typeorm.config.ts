import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { setupSshTunnel } from './ssh-tunnel';

const env = process.env.NODE_ENV || 'development';

export default async function getTypeOrmConfig(): Promise<TypeOrmModuleOptions> {

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

