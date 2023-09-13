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

  async set() {
    try {
      const result = await this.redis.lPush('redis-key', [
        'banana',
        'orage',
        'apple',
      ]);
      return result;
    } catch (error) {
      console.log('error :>> ', error);
    }
  }
}
