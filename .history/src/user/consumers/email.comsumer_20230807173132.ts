import { MailerService } from '@nest-modules/mailer';
import { Processor, Process } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Job } from 'bull';

@Injectable()
@Processor('send-email')
export class EmailConsumer {
  constructor(private mailerservice: MailerService) {}
  @Process('register')
  async registerEmail(job: Job<unknown>) {
    console.log('data :>> ', job.data);
  }
}
