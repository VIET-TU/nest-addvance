// import {
//   CallHandler,
//   ExecutionContext,
//   Inject,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable, of } from 'rxjs';
// import { RedisClient } from './redis-client.type';

// @Injectable()
// export class RedisCacheInterceptor implements NestInterceptor {
//   constructor(@Inject('REDIS_CLIENT') private readonly redis: RedisClient) {}
//   async intercept(context: ExecutionContext, next: CallHandler<any>) {
//     const request = context.switchToHttp().getRequest();
//     const reponse = context.switchToHttp().getResponse();

//     const cacheKey = 'eqwewq';

//     return this.redis.get(cacheKey).pipe(
//       switchMap((cachedResponse) => {
//         if (cachedResponse) {
//           return of(JSON.parse(cachedResponse));
//         }

//         return next.handle().pipe(
//           switchMap((controllerResponse) => {
//             if (controllerResponse ) {
//               return this.redis.set(cacheKey, JSON.stringify(controllerResponse))
//                 .pipe(map(() => controllerResponse));
//             }

//             return of(controllerResponse);
//           }),
//         );
//       }),
//     );
//   }
// }
