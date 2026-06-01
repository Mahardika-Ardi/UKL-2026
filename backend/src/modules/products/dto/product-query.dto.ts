import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from 'src/shared/dto/pagination.dto';

export class ProductQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'store-id' })
  @IsOptional()
  @IsString()
  storeId?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBooleanString()
  isActive?: string;
}
