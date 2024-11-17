import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import { config } from 'dotenv';
import { setupSshTunnel } from './configs/ssh-tunnel';

config();

async function bootstrap() {
  await setupSshTunnel();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
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
        name: 'Authorization',
        in: 'header',
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

<<<<<<< HEAD
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
=======
	app.setGlobalPrefix('api');
	
	await app.listen(process.env.PORT ?? 3000);
>>>>>>> b83a9db (feat: 매수 로직)
}
bootstrap();
