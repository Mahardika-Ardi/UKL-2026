import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { AddressService } from './address.service';

describe('AddressService', () => {
  let service: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        { provide: PrismaService, useValue: {} },
        {
          provide: LoggerService,
          useValue: { setContext: () => ({ log: jest.fn(), warn: jest.fn() }) },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
