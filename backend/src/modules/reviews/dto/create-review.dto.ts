import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'order-id' })
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @ApiProperty({ example: 'product-id' })
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiPropertyOptional({ example: 'Barangnya bagus' })
  @IsOptional()
  @IsString()
  comment?: string;
}
