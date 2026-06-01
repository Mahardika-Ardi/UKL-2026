import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({ example: 'Tokoku' })
  @IsNotEmpty({ message: 'Store name is required' })
  @IsString({ message: 'Store name must be a string' })
  name!: string;

  @ApiPropertyOptional({ example: 'Toko perlengkapan sekolah' })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @ApiProperty({ example: '08:00' })
  @IsNotEmpty({ message: 'Open time is required' })
  @IsString({ message: 'Open time must be a string' })
  openTime!: string;

  @ApiProperty({ example: '22:00' })
  @IsNotEmpty({ message: 'Close time is required' })
  @IsString({ message: 'Close time must be a string' })
  closeTime!: string;
}
