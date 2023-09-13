import { Controller, Get, Inject, UseGuards, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('subscriber')
export class SubscriberController {
  constructor(
    @Inject('SUBSCRIPER_SERVICE')
    private readonly subcriberService: ClientProxy,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getSubcriber() {
    return this.subcriberService.send(
      {
        cmd: 'get-all-subscriper',
      },
      {},
    );
  }

  @Post()
  async createSubscriberEvent(@Req() req: Request) {
    return this.subcriberService.send(
      {
        cmd: 'add-subscriber',
      },
      { name: 'viettu' },
    );
  }
}
