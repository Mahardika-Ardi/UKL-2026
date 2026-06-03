import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { OtpType } from 'generated/prisma/enums';
import { BlacklistService } from 'src/modules/auth/blacklist/blacklist.service';
import { AppError } from 'src/shared/utils/app-error.utils';

import { OtpService } from '../otp/otp.service';
import { loginSelect, registerSelect } from './auth-select';
import { LogInDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OtpDto } from './dto/token.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { PasswordService } from './security/password.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { MailService } from 'src/infrastructure/mail/mail.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';

@Injectable()
export class AuthService {
  private readonly logger: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly hash: PasswordService,
    private readonly jwt: JwtService,
    private readonly otp: OtpService,
    private readonly mail: MailService,
    private readonly blacklist: BlacklistService,
    private readonly config: ConfigService,
    readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.setContext(AuthService.name);
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { email: true },
    });

    if (existing?.email == dto.email) {
      this.logger.warn('Register attempt with existing email', {
        email: dto.email,
      });
      throw AppError.conflict('Email', {
        message: 'E - Mail is already used, try another!',
      });
    }

    const hashedPassword = await this.hash.hash(dto.password);

    const user = await this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
      select: registerSelect,
    });

    this.logger.log('User registered', { userId: user.id, email: user.email });

    return user;
  }

  async login(dto: LogInDto, res: Response) {
    const check = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { phone: dto.phone }] },
      select: loginSelect,
    });

    if (!check) {
      this.logger.warn('Login attempt with unregistered credentials', {
        email: dto.email,
      });
      throw AppError.unauthorized('Invalid', {
        message: 'Invalid Credentials',
      });
    }

    const comparePassword = await this.hash.verify(
      check.password,
      dto.password,
    );

    if (!comparePassword) {
      this.logger.warn('Login attempt with wrong password', {
        userId: check.id,
        email: check.email,
      });
      throw AppError.unauthorized('Invalid', {
        message: 'Invalid Credentials',
      });
    }

    const payload = {
      id: check.id,
      email: check.email,
      phone: check.phone,
      role: check.role,
    } as const;
    const token = await this.jwt.signAsync(payload);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: this.config.getOrThrow<string>('app.nodeEnv') === 'production',
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    this.logger.log('Login Successful', {
      userId: payload.id,
      email: payload.email,
    });

    return payload;
  }

  async logout(token: string, res: Response) {
    type JwtDecoded = { exp: number };
    const decoded: JwtDecoded = await this.jwt.decode(token);
    const now = Math.floor(Date.now() / 1000);
    const ttl = decoded.exp - now;

    if (ttl > 0) {
      await this.blacklist.blacklist(token, ttl);
    }

    res.clearCookie('access_token', {
      httpOnly: true,
      secure: this.config.getOrThrow<string>('app.nodeEnv') === 'production',
      sameSite: 'none',
    });
    this.logger.log('Logout successful');

    return 'LogOut Successfully';
  }

  async forgotPassword(id: string) {
    this.logger.log('Forgot password requested', { userId: id });

    const user = await this.prisma.user.findFirst({
      where: { id },
      select: { email: true },
    });

    if (!user) {
      this.logger.warn('Forgot password - user not found', { userId: id });
      throw AppError.notFound('User', {
        message: 'No account found with this id',
      });
    }

    const code = await this.otp.generate(id, OtpType.RESET_PASSWORD);
    await this.mail.queueSendOtp(user.email, 'Reset Password', code);

    this.logger.log('Reset password OTP sent', { userId: id });

    return 'OTP code has been sent to your email';
  }

  async refreshOtp(id: string, dto: OtpDto) {
    this.logger.log('OTP refresh requested', { userId: id, type: dto.type });

    const user = await this.prisma.user.findFirst({
      where: { id },
      select: { email: true },
    });

    if (!user) {
      this.logger.warn('Refresh OTP - user not found', { userId: id });
      throw AppError.notFound('User', {
        message: 'No account found with this id',
      });
    }

    const code = await this.otp.generate(id, dto.type);
    const title = dto.type
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    await this.mail.sendotp(user.email, title, code);

    this.logger.log('OTP sent', { userId: id, type: dto.type });

    return 'OTP code has been sent to your email';
  }

  async resetPassword(id: string, dto: ResetPasswordDto) {
    this.logger.log('Reset password attempt', { userId: id });

    await this.otp.verify(dto.code, OtpType.RESET_PASSWORD, id);

    const hashed = await this.hash.hash(dto.password);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashed },
    });

    this.logger.log('Password reset successful', { userId: id });

    return 'Password has been reset successfully';
  }

  async sendVerificationEmail(id: string) {
    this.logger.log('Verification email requested', { userId: id });

    const user = await this.prisma.user.findFirst({
      where: { id },
      select: { email: true, isEmailVerified: true },
    });

    if (!user) {
      this.logger.warn('Send verification - user not found', { userId: id });
      throw AppError.notFound('User', {
        message: 'No account found with this id',
      });
    }

    if (user.isEmailVerified) {
      this.logger.warn('Send verification - email already verified', {
        userId: id,
      });
      throw AppError.badRequest({
        message: 'Email is already verified',
      });
    }

    const code = await this.otp.generate(id, OtpType.EMAIL_VERIFICATION);
    const title = OtpType.EMAIL_VERIFICATION.toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

    await this.mail.sendotp(user.email, title, code);

    this.logger.log('Verification email sent', { userId: id });

    return 'OTP code has been sent to your email';
  }

  async VerifyEmail(id: string, verifyEmailDto: VerifyEmailDto) {
    this.logger.log('Email verification attempt', { userId: id });

    const user = await this.prisma.user.findFirst({
      where: { id },
      select: { isEmailVerified: true },
    });

    if (!user) {
      this.logger.warn('Verify email - user not found', { userId: id });
      throw AppError.notFound('User', {
        message: 'No account found with this id',
      });
    }

    if (user.isEmailVerified) {
      this.logger.warn('Verify email - already verified', { userId: id });
      throw AppError.badRequest({
        message: 'Email is already verified',
      });
    }

    await this.otp.verify(verifyEmailDto.code, OtpType.EMAIL_VERIFICATION, id);

    await this.prisma.user.update({
      where: { id },
      data: { isEmailVerified: true },
    });

    this.logger.log('Email verified successfully', { userId: id });

    return 'Seccessfully verified email';
  }
}
