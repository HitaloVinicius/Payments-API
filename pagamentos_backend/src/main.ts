import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(morgan('dev'))
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  const config = new DocumentBuilder()
    .setTitle('Payments API')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
