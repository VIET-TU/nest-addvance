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
        cmd: 'get-all-subscriber',
      },
      {},
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createSubscriberEvent(@Req() req: Request) {
    return this.subcriberService.send(
      {
        cmd: 'add-subscriber',
      },
      req.user,
    );
  }

  @Post('event')
  @UseGuards(AuthGuard('jwt'))
  async createSubscriber(@Req() req: Request) {
    this.subcriberService.emit(
      {
        cmd: 'add-subsscriber',
      },
      req.user,
    );
    return true;
  }

  @Post('rmq')
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Req() req: any) {
    return this.subcriberService.send(
      {
        cmd: 'add-subscriber',
      },
      req.user,
    );
  }
}
