import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Gender } from 'generated/prisma/enums';

export class RegisterDto {
  @ApiProperty({ example: 'jane.doe@mail.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @ApiProperty({ example: 'StrongPass!123' })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @IsStrongPassword(
    {},
    {
      message:
        'Password must be at least 8 characters and contain uppercase letters, numbers, and symbols',
    },
  )
  password!: string;

  @ApiProperty({ example: 'Jane' })
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  firstName!: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;

  @ApiProperty({ example: '2000-01-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'Birth date is required' })
  @IsDate({ message: 'Birth date must be a valid date' })
  birthDate!: Date;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsNotEmpty({ message: 'Gender is required' })
  @IsEnum(Gender, {
    message: `Gender must be one of the following values: ${Object.values(Gender).join(', ')}`,
  })
  gender!: Gender;
}
