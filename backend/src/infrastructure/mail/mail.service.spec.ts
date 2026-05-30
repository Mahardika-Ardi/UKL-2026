import { getQueueToken } from '@nestjs/bullmq';
import { Test, TestingModule } from '@nestjs/testing';
import { MAIL_QUEUE } from 'src/shared/constants/mail-queue.constant';

import { LoggerService } from '../logger/logger.service';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: getQueueToken(MAIL_QUEUE), useValue: { add: jest.fn() } },
        {
          provide: LoggerService,
          useValue: { setContext: () => ({ debug: jest.fn() }) },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
