import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import { ExceptionLoggerFilter } from './utils/exceptionLogger.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: '*',
    methods: '*',
  });

  // app.useGlobalPipes(new ValidationPipe());
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new ExceptionLoggerFilter(httpAdapter));

  await app.listen(3000);
}
bootstrap();
