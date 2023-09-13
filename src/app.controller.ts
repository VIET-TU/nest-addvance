import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('redis-ping')
  redisPing() {
    return this.appService.redisPing();
  }

  @Get('redis-set')
  async redisSet() {
    return await this.appService.redisSet();
  }
}