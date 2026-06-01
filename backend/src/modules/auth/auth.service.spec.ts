import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BlacklistService } from 'src/modules/auth/blacklist/blacklist.service';

import { OtpService } from '../otp/otp.service';
import { AuthService } from './auth.service';
import { PasswordService } from './security/password.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { MailService } from 'src/infrastructure/mail/mail.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: {} },
        { provide: PasswordService, useValue: {} },
        { provide: JwtService, useValue: {} },
        { provide: OtpService, useValue: {} },
        { provide: MailService, useValue: {} },
        { provide: BlacklistService, useValue: {} },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(() => 'test'),
            get: jest.fn(() => undefined),
          },
        },
        { provide: LoggerService, useValue: { setContext: () => ({}) } },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
