import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { MailProcessor } from 'src/jobs/processor/mail.processor';
import { MAIL_QUEUE } from 'src/shared/constants/mail-queue.constant';

import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
  ],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
