import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';
import { createTunnel } from 'tunnel-ssh'; 

const env = process.env.NODE_ENV || 'development';
const envFileName = `.env.${env}`;
const envPath = resolve(process.cwd(), envFileName);

config({ path: envPath });

export default async function getTypeOrmConfig(): Promise<TypeOrmModuleOptions> {
	if (env === 'production') {
		console.log('배포 환경에서 데이터베이스에 직접 연결합니다.');

		return {
			type: 'mysql',
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			entities: [__dirname + '/../**/*.entity.{js,ts}'],
			synchronize: false, 
		};
	} else {
		await setupSshTunnel();
		console.log('SSH 터널링 설정 완료');
		console.log('데이터베이스 연결 시도 중...');

		return {
			type: process.env.DB_TYPE as 'mysql',
			host: '127.0.0.1', // 로컬 IP
			port: 3307, // 터널링된 로컬 포트
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			entities: [__dirname + '/../**/*.entity.{js,ts}'],
			synchronize: env === 'development',
		};
	}
}

async function setupSshTunnel(): Promise<void> {
	return new Promise((resolve, reject) => {
		const sshOptions = {
			host: process.env.SSH_HOST,
			port: Number(process.env.SSH_PORT),
			username: process.env.SSH_USER,
			password: process.env.SSH_PASSWORD,
		};

		const port = 3307; // 로컬에서 사용할 포트

		tunnel(sshOptions, port)
			.then(() => {
				resolve();
			})
			.catch((error) => {
				console.error('SSH 터널링 설정 중 오류 발생:', error);
				reject(error);
			});
	});
}

function tunnel(sshOptions, port, autoClose = true): Promise<void> {
	return new Promise((resolve, reject) => {
		const forwardOptions = {
			srcAddr: '127.0.0.1',
			srcPort: port,
			dstAddr: process.env.SSH_DB_HOST, // 원격 DB 서버 IP
			dstPort: 3306, // 원격 DB 포트
		};

		const tunnelOptions = {
			autoClose: autoClose,
		};

		const serverOptions = {
			port: port,
		};

		createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions)
			.then((server) => {
				console.log('SSH 터널링이 성공적으로 설정되었습니다.');
				resolve();
			})
			.catch((error) => {
				console.error('터널 생성 중 오류 발생:', error);
				reject(error);
			});
	});
}
