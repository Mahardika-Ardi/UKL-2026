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
    .setDescription('Dokumentasi API untuk aplikasi backend atributo.')
    .setVersion('1.0.0')
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
      description: 'JWT access token yang disimpan pada cookie httpOnly',
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  if (process.env.NODE_ENV != 'production') {
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }
  const logger = app.get(LoggerService);
  app.useLogger(logger);
  const PORT = Number(process.env.PORT);

  await app.listen(PORT ?? 3000);
  logger.log(`Application started on port ${PORT}`, { context: 'Bootstrap' });
  logger.log('Swagger docs available at /docs', { context: 'Bootstrap' });
  app.enableShutdownHooks();
}

bootstrap(); // TODO update some of theese to production level
