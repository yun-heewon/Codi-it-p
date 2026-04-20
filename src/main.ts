import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [process.env.FRONTEND_URL, 'https://codi-it-web.vercel.app'], // 프론트엔드 주소 허용
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    maxAge: 86400,
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
      'Cache-Control',
      'Connection',
      'Last-Event-ID',
    ],
    exposedHeaders: ['Set-Cookie'],
  });
  app.setGlobalPrefix('api');

  // --- Swagger 설정 시작 ---
  const config = new DocumentBuilder()
    .setTitle('Codi-it API')
    .setDescription('Codi-it 프로젝트 API 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // 브라우저에서 /api-docs로 접속
  // --- Swagger 설정 끝 ---

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
