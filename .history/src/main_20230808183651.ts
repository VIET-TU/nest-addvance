import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import { ExceptionLoggerFilter } from './utils/exceptionLogger.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  // const options = {
  //   origin: '*',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   preflightContinue: false,
  //   credentials: true,
  // };
  // //app.use(cors(options))
  // app.enableCors(options);
  app.use(
    cors({
      origin: 'http://127.0.0.1:5500/',
    }),
  );

  app.useGlobalPipes(new ValidationPipe());
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new ExceptionLoggerFilter(httpAdapter));

  await app.listen(3000);
}
bootstrap();
