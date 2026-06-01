import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VerificationStatus } from 'generated/prisma/enums';
import { IsEnum, IsString, ValidateIf } from 'class-validator';

export class ReviewStoreDto {
  @ApiProperty({
    enum: VerificationStatus,
    example: VerificationStatus.APPROVED,
  })
  @IsEnum(VerificationStatus)
  status!: VerificationStatus;

  @ApiPropertyOptional({ example: 'Dokumen belum jelas' })
  @ValidateIf(
    (dto: { status?: VerificationStatus }) =>
      dto.status === VerificationStatus.REJECTED,
  )
  @IsString({ message: 'Rejected reason must be a string' })
  rejectedReason?: string;
}
