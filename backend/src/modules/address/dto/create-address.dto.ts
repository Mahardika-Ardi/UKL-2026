import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsPostalCode,
  IsString,
} from 'class-validator';
import { AddressLabel } from 'generated/prisma/enums';

export class CreateAddressDto {
  @ApiProperty({ enum: AddressLabel, example: AddressLabel.RUMAH })
  @IsNotEmpty()
  @IsEnum(AddressLabel)
  label!: AddressLabel;

  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  recipientName?: string;

  @ApiProperty({ example: '+6281234567890' })
  @IsNotEmpty()
  @IsPhoneNumber('ID')
  phone!: string;

  @ApiProperty({ example: 'Jl. Merdeka No. 10' })
  @IsNotEmpty()
  @IsString()
  street!: string;

  @ApiProperty({ example: 'Surabaya' })
  @IsNotEmpty()
  @IsString()
  city!: string;

  @ApiProperty({ example: 'Jawa Timur' })
  @IsNotEmpty()
  @IsString()
  province!: string;

  @ApiProperty({ example: '60231' })
  @IsNotEmpty()
  @IsPostalCode('ID')
  postalCode!: string;
}
