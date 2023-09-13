import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

@Controller('subscriber')
export class SubcriberController {
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
}
