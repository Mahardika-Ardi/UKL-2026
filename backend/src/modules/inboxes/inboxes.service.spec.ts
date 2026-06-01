import { Test, TestingModule } from '@nestjs/testing';

import { CacheService } from 'src/infrastructure/cache/cache.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

import { InboxesService } from './inboxes.service';

describe('InboxesService', () => {
  let service: InboxesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InboxesService,
        { provide: PrismaService, useValue: {} },
        { provide: CacheService, useValue: {} },
        {
          provide: LoggerService,
          useValue: { setContext: () => ({}) },
        },
      ],
    }).compile();

    service = module.get<InboxesService>(InboxesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
