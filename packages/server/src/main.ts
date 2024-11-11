import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// app.enableCors({
	// 	origin: ['http://localhost:5173', 'http://175.106.98.147'], // 허용할 클라이언트 주소
	// 	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	// 	credentials: true,
	// });

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
