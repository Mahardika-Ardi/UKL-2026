import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        stores: [
          new KeyvRedis(
            `redis://:${config.get('redis.password')}@${config.getOrThrow('redis.host')}:${config.getOrThrow('redis.port')}`,
          ),
        ],
        ttl: 0,
      }),
      isGlobal: true,
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
