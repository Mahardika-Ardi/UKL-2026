import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { OtpType } from 'generated/prisma/enums';

export class OtpDto {
  @ApiProperty({ enum: OtpType, example: OtpType.EMAIL_VERIFICATION })
  @IsNotEmpty({ message: 'Type is required' })
  @IsEnum(OtpType, {
    message: `Otp type must be one of the following values: ${Object.values(OtpType).join(', ')}`,
  })
  type!: OtpType;
}
