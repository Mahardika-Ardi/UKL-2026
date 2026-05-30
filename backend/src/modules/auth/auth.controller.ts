import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

import { AuthService } from './auth.service';
import { LogInDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OtpDto } from './dto/token.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @Throttle({ global: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Register akun baru' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Register berhasil' })
  async register(@Body() dto: RegisterDto) {
    const data = await this.authService.register(dto);
    return {
      message: 'Register Successfully',
      data,
    };
  }

  @Public()
  @Post('login')
  @Throttle({ global: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login user dan set access token cookie' })
  @ApiBody({ type: LogInDto })
  @ApiResponse({ status: 201, description: 'Login berhasil' })
  async login(
    @Body() dto: LogInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(dto, res);
    return {
      message: data,
    };
  }

  @Post('logout')
  @SkipThrottle()
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Logout user dan hapus access token cookie' })
  @ApiResponse({ status: 201, description: 'Logout berhasil' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['access_token'] as string;
    const data = await this.authService.logout(token, res);
    return {
      message: data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-otp')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Kirim ulang OTP berdasarkan tipe OTP' })
  @ApiBody({ type: OtpDto })
  @ApiResponse({ status: 201, description: 'OTP berhasil dikirim ulang' })
  async refreshOtp(@CurrentUser('id') id: string, @Body() dto: OtpDto) {
    const data = await this.authService.refreshOtp(id, dto);
    return { message: data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('forgot-password')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Kirim OTP untuk reset password' })
  @ApiResponse({
    status: 201,
    description: 'OTP reset password berhasil dikirim',
  })
  async forgotPassword(@CurrentUser('id') id: string) {
    const data = await this.authService.forgotPassword(id);
    return { message: data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Reset password dengan OTP valid' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 201, description: 'Password berhasil direset' })
  async resetPassword(
    @CurrentUser('id') id: string,
    @Body() dto: ResetPasswordDto,
  ) {
    const data = await this.authService.resetPassword(id, dto);
    return { message: data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-verification-email')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Kirim OTP verifikasi email' })
  @ApiResponse({
    status: 201,
    description: 'OTP verifikasi email berhasil dikirim',
  })
  async sendVerificationEmail(@CurrentUser('id') id: string) {
    const data = await this.authService.sendVerificationEmail(id);
    return { message: data };
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-email')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Verifikasi email dengan OTP' })
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({ status: 201, description: 'Email berhasil diverifikasi' })
  async VerifyEmail(
    @CurrentUser('id') id: string,
    @Body() dto: VerifyEmailDto,
  ) {
    const data = await this.authService.VerifyEmail(id, dto);
    return { message: data };
  }
}
