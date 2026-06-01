import { Test, TestingModule } from '@nestjs/testing';

import { CacheService } from 'src/infrastructure/cache/cache.service';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

import { StoresService } from './stores.service';

describe('StoresService', () => {
  let service: StoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        { provide: PrismaService, useValue: {} },
        { provide: CacheService, useValue: {} },
        { provide: CloudinaryService, useValue: {} },
        {
          provide: LoggerService,
          useValue: { setContext: () => ({}) },
        },
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
