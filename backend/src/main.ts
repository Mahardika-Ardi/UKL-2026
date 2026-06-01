import 'dotenv/config';

import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/filters/http-exception.filter';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { LoggerService } from './infrastructure/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.use(helmet({ contentSecurityPolicy: true, hidePoweredBy: true }));
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credential: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api', { exclude: ['/', 'health'] });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(LoggerService)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Atributo API')
    .setDescription(
      [
        'Dokumentasi API backend Atributo untuk ecommerce.',
        '',
        'Semua response sukses mengikuti envelope: success, message, data, timestamp.',
        'Response error mengikuti envelope: success=false, code, message, timestamp, details?.',
        '',
        'Base API: /api/v1',
        'Health check: /health',
        'Detail ringkas yang mudah dibaca ada di docs/swagger-guide.md.',
      ].join('\n'),
    )
    .setVersion('1.0.0')
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
      description: 'JWT access token yang disimpan pada cookie httpOnly',
    })
    .addTag('Auth', 'Login, register, OTP, dan session management')
    .addTag('Users', 'Profil user dan manajemen akun')
    .addTag('Address', 'Manajemen alamat pengiriman')
    .addTag('Stores', 'Manajemen store dan verifikasi toko')
    .addTag('Products', 'Katalog produk dan manajemen stok')
    .addTag('Cart', 'Keranjang belanja user')
    .addTag('Orders', 'Checkout, status order, dan pembatalan')
    .addTag('Reviews', 'Review produk dari user')
    .addTag('Inboxes', 'Notifikasi order dan pesan sistem')
    .addTag('Health', 'Health check service dan database')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // if (process.env.NODE_ENV != 'production') {
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Atributo API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
  // }
  const logger = app.get(LoggerService);
  app.useLogger(logger);
  const PORT = Number(process.env.PORT);

  await app.listen(PORT ?? 3000);
  logger.log(`Application started on port ${PORT}`, { context: 'Bootstrap' });
  logger.log('Swagger docs available at /docs', { context: 'Bootstrap' });
  app.enableShutdownHooks();
}

void bootstrap(); // TODO update some of theese to production level
