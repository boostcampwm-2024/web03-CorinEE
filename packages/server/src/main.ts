import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
	SwaggerModule,
	DocumentBuilder,
	SwaggerCustomOptions,
} from '@nestjs/swagger';
import { config } from 'dotenv';
import { setupSshTunnel } from './configs/ssh-tunnel';
import { AllExceptionsFilter } from 'common/all-exceptions.filter';

config();

async function bootstrap() {
	await setupSshTunnel();
	const app = await NestFactory.create(AppModule);
	app.enableCors({
		origin: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	});

	const config = new DocumentBuilder()
		.setTitle('CorinEE API example')
		.setDescription('CorinEE API description')
		.setVersion('1.0')
		.addTag('corinee')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				description: 'Access token used for authentication',
			},
			'access-token',
		)
		.build();
	const customOptions: SwaggerCustomOptions = {
		swaggerOptions: {
			persistAuthorization: true,
		},
	};
	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, documentFactory);

	app.setGlobalPrefix('api');
	app.useGlobalFilters(new AllExceptionsFilter());

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
