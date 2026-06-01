import { getQueueToken } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CLOUDINARY_QUEUE } from 'src/shared/constants/cloudinary-queue.constant';

import { LoggerService } from '../logger/logger.service';
import { CloudinaryService } from './cloudinary.service';

jest.mock('bullmq', () => {
  const actual = jest.requireActual<typeof import('bullmq')>('bullmq');
  return {
    ...actual,
    QueueEvents: jest.fn().mockImplementation(() => ({})),
  };
});

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        {
          provide: getQueueToken(CLOUDINARY_QUEUE),
          useValue: { add: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              if (key === 'redis.host') return 'localhost';
              if (key === 'redis.port') return 6379;
              if (key === 'cloudinary.name') return 'demo';
              if (key === 'cloudinary.apiKey') return 'key';
              if (key === 'cloudinary.apiSecret') return 'secret';
              throw new Error(`Unexpected key ${key}`);
            }),
            get: jest.fn(() => undefined),
          },
        },
        {
          provide: LoggerService,
          useValue: { setContext: () => ({ debug: jest.fn() }) },
        },
      ],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
