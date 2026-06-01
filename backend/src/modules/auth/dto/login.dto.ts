import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class LogInDto {
  @ApiProperty({ example: 'jane.doe@mail.com' })
  @IsNotEmpty()
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @ApiProperty({ example: 'StrongPass!123' })
  @IsNotEmpty()
  @IsString({ message: 'Password must be a string' })
  @IsStrongPassword(
    {},
    {
      message:
        'Password must be at least 8 characters and contain uppercase letters, numbers, and symbols',
    },
  )
  password!: string;

  @ApiPropertyOptional({ example: '+6281234567890' })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('ID', {
    message:
      'Phone number must be a valid Indonesian phone number (e.g. +6281234567890)',
  })
  phone?: string;
}
