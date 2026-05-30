import { Test, TestingModule } from '@nestjs/testing';

import { OtpService } from './otp.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

describe('OtpService', () => {
  let service: OtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OtpService,
        {
          provide: PrismaService,
          useValue: {
            otp: { create: jest.fn(), findFirst: jest.fn(), update: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
