import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from './models/post.model';
import { PostRepository } from './repositories/post.repository';
import { UserModule } from '../user/user.module';
import { CategorySchema } from './models/category.model';
import { CategoryController } from './controllers/category.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './services/category.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommandHandler } from './handler/createPost.handler';
import { GetPostHandler } from './handler/getPost.handler';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Post',
        schema: PostSchema,
      },
      {
        name: 'Category',
        schema: CategorySchema,
      },
    ]),
    UserModule,
    CqrsModule,
    // CacheModule.register({
    //   ttl: 20 * 1000, // 10s
    // }),

    // CacheModule.registerAsync<RedisClientOptions>({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     store: redisStore,
    //     host: configService.get<string>('REDIS_HOST'),
    //     port: configService.get<number>('REDIS_PORT'),
    //     username: configService.get<string>('REDIS_USERNAME'),
    //     password: configService.get<string>('REDIS_PASSWORD'),
    //   }),
    //   inject: [ConfigService],
    // }),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: (await redisStore({
          url: configService.get('REDIS_URL'),
        })) as unknown as CacheStore,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PostController, CategoryController],
  providers: [
    PostService,
    PostRepository,
    CategoryRepository,
    CategoryService,
    CreateCommandHandler,
    GetPostHandler,
  ],
})
export class PostModule {}
