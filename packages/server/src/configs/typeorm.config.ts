import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { createTunnel } from 'tunnel-ssh'; 

config();

const env = process.env.NODE_ENV || 'development';

export default async function getTypeOrmConfig(): Promise<TypeOrmModuleOptions> {
	if(env === 'development') await setupSshTunnel();
	return {
		type: process.env.DB_TYPE as 'mysql',
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		entities: [__dirname + '/../**/*.entity.{js,ts}'],
		synchronize: false, 
	};
}

async function setupSshTunnel(): Promise<void> {
	return new Promise((resolve, reject) => {
		const sshOptions = {
			host: process.env.SSH_HOST,
			port: Number(process.env.SSH_PORT),
			username: process.env.SSH_USER,
			password: process.env.SSH_PASSWORD,
		};

		const port = process.env.DB_PORT; // 로컬에서 사용할 포트

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
			srcAddr: process.env.DB_HOST,
			srcPort: port,
			dstAddr: process.env.SSH_DB_HOST, // 원격 DB 서버 IP
			dstPort: Number(process.env.SSH_DB_TUNNUL_PORT), // 원격 DB 포트
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
