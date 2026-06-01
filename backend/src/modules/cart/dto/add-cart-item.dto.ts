import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({ example: 'product-id' })
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ example: 2, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;
}
