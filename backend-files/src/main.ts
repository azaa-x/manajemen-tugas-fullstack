// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS: izinkan frontend (Vite) memanggil API ini dari browser.
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  });

  // ValidationPipe global: seluruh DTO divalidasi otomatis.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // buang properti yang tidak ada di DTO
      forbidNonWhitelisted: true, // tolak request jika ada properti asing
      transform: true, // ubah payload menjadi instance DTO
    }),
  );

  // Exception filter global: bentuk respons error seragam + logging.
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3001);
}
bootstrap();
