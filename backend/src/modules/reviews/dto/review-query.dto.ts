import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from 'src/shared/dto/pagination.dto';

export class ReviewQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'product-id' })
  @IsOptional()
  @IsString()
  productId?: string;
}
