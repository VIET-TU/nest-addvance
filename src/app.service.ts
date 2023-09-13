import { Injectable } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async redisPing() {
    return this.redisService.ping();
  }

  async redisSet() {
    return this.redisService.set();
  }
}
