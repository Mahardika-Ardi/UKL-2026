import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import {
  MAIL_JOB,
  MAIL_QUEUE,
} from '../../shared/constants/mail-queue.constant';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { MailService } from 'src/infrastructure/mail/mail.service';

type sendOtpJob = {
  email: string;
  title: string;
  code: string;
};

@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  private readonly logger: LoggerService;

  constructor(
    private readonly mail: MailService,
    private readonly loggerService: LoggerService,
  ) {
    super();
    this.logger = loggerService.setContext(MailProcessor.name);
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case MAIL_JOB.SEND_OTP:
        await this.handleSendOtp(job.data as sendOtpJob);
        break;
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async handleSendOtp(data: sendOtpJob): Promise<void> {
    this.logger.log('Processing send OTP job', { email: data.email });

    try {
      await this.mail.sendotp(data.email, data.title, data.code);
      this.logger.log('OTP email sent successfully', { email: data.email });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Failed to send OTP email', err.stack, {
        email: data.email,
      });
      throw error;
    }
  }
}
