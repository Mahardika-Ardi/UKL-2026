import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  appConfig,
  cloudinaryConfig,
  dbConfig,
  jwtConfig,
  mailConfig,
  redisConfig,
  validationSchema,
} from './config/env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { BlacklistModule } from './modules/auth/blacklist/blacklist.module';
import { BlacklistService } from './modules/auth/blacklist/blacklist.service';
import { PasswordModule } from './modules/auth/security/password.module';
import { HealthModule } from './modules/health/health.module';
import { OtpService } from './modules/otp/otp.service';
import { UsersModule } from './modules/users/users.module';
import { HttpLoggerMiddleware } from './shared/middleware/http-logger.middleware';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { CacheService } from './infrastructure/cache/cache.service';
import { CloudinaryModule } from './infrastructure/cloudinary/cloudinary.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { AddressModule } from './modules/address/address.module';
import { CartModule } from './modules/cart/cart.module';
import { InboxesModule } from './modules/inboxes/inboxes.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { StoresModule } from './modules/stores/stores.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'global',
          ttl: 60000,
          limit: 100,
        },
      ],
      storage: new ThrottlerStorageRedisService({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      }),
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema,
      validationOptions: { abortEarly: true },
      load: [
        appConfig,
        dbConfig,
        jwtConfig,
        redisConfig,
        cloudinaryConfig,
        mailConfig,
      ],
    }),
    PrismaModule,
    PasswordModule,
    UsersModule,
    LoggerModule,
    HealthModule,
    AuthModule,
    MailModule,
    RedisModule,
    BlacklistModule,
    CacheModule,
    CloudinaryModule,
    AddressModule,
    StoresModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    ReviewsModule,
    InboxesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
    OtpService,
    BlacklistService,
    CacheService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
