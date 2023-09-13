import { FactoryProvider } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisClient } from './redis-client.type';

export const redisClientFactory: FactoryProvider<Promise<RedisClient>> = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const client = createClient({
      url: 'redis://default:geW0sYeo7M3OhkbrLX0RSfhfXfYpoCxz@redis-15153.c292.ap-southeast-1-1.ec2.cloud.redislabs.com:15153',
    });
    await client.connect();
    return client;
  },
};
