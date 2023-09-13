import { Module } from '@nestjs/common';
import { redisClientFactory } from './redis-client.factory';
import { RedisService } from 'nestjs-redis';

@Module({
  providers: [redisClientFactory],
  exports: [RedisService],
})
export class RedisModule {}
