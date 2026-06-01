import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { PaymentMethod } from 'generated/prisma/enums';

export class CreateOrderDto {
  @ApiProperty({ example: 'store-id' })
  @IsNotEmpty()
  storeId!: string;

  @ApiProperty({ example: 'address-id' })
  @IsNotEmpty()
  addressId!: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.COD })
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @ApiProperty({ example: 10000 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  shippingFee!: number;
}
