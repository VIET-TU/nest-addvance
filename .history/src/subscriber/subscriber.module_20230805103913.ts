import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { SubcriberController } from './subscriber.controller';

@Module({
  imports: [ConfigModule],
  controllers: [SubcriberController],
  providers: [
    {
      provide: 'SUBSCRIBER_SERVICE',
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get('SUBSCRIBER_SERVICE_HOST'),
            port: configService.get('SUBSCRIBER_SERVICE_PORT'),
          },
        }),
      inject: [ConfigService],
    },
  ],
})
export class SubscriberModule {}
