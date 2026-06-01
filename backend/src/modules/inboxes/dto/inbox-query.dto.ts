import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional } from 'class-validator';

import { PaginationDto } from 'src/shared/dto/pagination.dto';

export class InboxQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBooleanString()
  isRead?: string;
}
