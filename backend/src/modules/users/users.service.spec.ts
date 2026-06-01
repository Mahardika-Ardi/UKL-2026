import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './users.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { CacheService } from 'src/infrastructure/cache/cache.service';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: {} },
        { provide: CacheService, useValue: {} },
        { provide: CloudinaryService, useValue: {} },
        { provide: LoggerService, useValue: { setContext: () => ({}) } },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
