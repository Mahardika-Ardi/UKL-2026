import { getQueueToken } from '@nestjs/bullmq';
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
