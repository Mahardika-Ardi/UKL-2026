import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';

export class UpdateUserDto extends PartialType(
  OmitType(RegisterDto, ['email', 'password'] as const),
) {
  @ApiPropertyOptional({ example: '+6281234567890' })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('ID', {
    message:
      'Phone number must be a valid Indonesian phone number (e.g. +6281234567890)',
  })
  phone?: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/demo/image/upload/v1/avatar.jpg',
  })
  @IsOptional()
  @IsUrl(
    { require_protocol: true },
    { message: 'Avatar URL must be a valid URL' },
  )
  avatarUrl?: string;

  @ApiPropertyOptional({ example: 'users/avatar_123' })
  @IsOptional()
  @Matches(/^[a-zA-Z0-9/_-]+$/, {
    message: 'Invalid Cloudinary public ID',
  })
  avatarPublicId?: string;
}
