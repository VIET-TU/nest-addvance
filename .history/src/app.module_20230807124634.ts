import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionLoggerFilter } from './utils/exceptionLogger.filter';
import { MediaModule } from './media/media.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { HandlebarsAdapter, MailerModule } from '@nest-modules/mailer';
import { join } from 'path';
// import { RedisModule } from './redis/redis.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import * as Redis from 'redis';
import { RedisService } from 'nestjs-redis';

@Module({
  imports: [
    PostModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      dbName: process.env.DB_NAME,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        // transport: config.get('MAIL_TRANSPORT'),
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'src/templates/email'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    MediaModule,
    SubscriberModule,
    // CacheModule.registerAsync({
    //   useFactory: async () => {
    //     const client = await Redis.createClient({
    //      url: 'fsdlfldsfjlsd',
    //     });
    //     return {
    //       store: client,
    //     };
    //   },
    // }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: (await Redis.createClient({
          url: configService.get('REDIS_URI'),
        })) as unknown as CacheStore,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RedisService,
    // RedisService,
    // {
    //   provide: APP_FILTER,
    //   useClass: ExceptionLoggerFilter,
    // },
  ],
})
export class AppModule {}
