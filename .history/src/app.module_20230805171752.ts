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
import { MailerModule } from '@nest-modules/mailer';

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
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
          default: {
            from: 'Not reply',
          },
        },
      }),
    }),
    UserModule,
    MediaModule,
    SubscriberModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: ExceptionLoggerFilter,
    // },
  ],
})
export class AppModule {}
