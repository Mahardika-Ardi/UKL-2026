import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';

import { BlacklistService } from './blacklist.service';

describe('BlacklistService', () => {
  let service: BlacklistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlacklistService,
        {
          provide: CACHE_MANAGER,
          useValue: { set: jest.fn(), get: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<BlacklistService>(BlacklistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
