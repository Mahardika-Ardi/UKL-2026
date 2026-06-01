import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from 'generated/prisma/enums';

import { PaginationDto } from 'src/shared/dto/pagination.dto';

export class OrderQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ example: 'store-id' })
  @IsOptional()
  @IsString()
  storeId?: string;
}
