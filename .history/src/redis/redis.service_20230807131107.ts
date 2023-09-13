import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { RedisClient } from './redis-client.type';

@Injectable()
export class RedisService implements OnModuleDestroy {
  public constructor(
    @Inject('REDIS_CLIENT') private readonly redis: RedisClient,
  ) {}

  onModuleDestroy() {
    this.redis.quit();
  }
  ping() {
    return this.redis.ping();
  }

  set() {
    try {
      return this.redis.set('redis', 'hello wrold');
    } catch (error) {
      console.log('error :>> ', error);
    }
  }
}
