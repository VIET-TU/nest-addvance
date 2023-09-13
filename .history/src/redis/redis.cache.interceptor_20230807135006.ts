import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RedisClient } from './redis-client.type';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: RedisClient) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const reponse = context.switchToHttp().getResponse();

    const cacheKey = 'eqwewq';

    try {
      const cachedData = await this.redis.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const controllerResponse = await next.handle().toPromise();

      if (controllerResponse) {
        await this.redis.setEx(
          cacheKey,
          60,
          JSON.stringify(controllerResponse),
        ); // Cache for 60 seconds
      }

      return controllerResponse;
    } catch (error) {
      console.error('Error while caching:', error);
      return next.handle(); // Proceed without caching
    }
  }
}
