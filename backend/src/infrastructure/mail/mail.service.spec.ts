import { getQueueToken } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
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
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'mail.host') return 'localhost';
              if (key === 'mail.port') return 2525;
              if (key === 'mail.user') return 'test@example.com';
              if (key === 'mail.password') return 'secret';
              return undefined;
            }),
          },
        },
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
