import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'generated/prisma/enums';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Buat order dari cart store tertentu' })
  @ApiResponse({ status: 201, description: 'Order berhasil dibuat' })
  async create(@CurrentUser('id') userId: string, @Body() dto: CreateOrderDto) {
    const data = await this.ordersService.create(userId, dto);
    return {
      message: 'Order successfully created',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Ambil daftar order user atau owner' })
  async findAll(
    @CurrentUser() user: { id: string; role: Role },
    @Query() query: OrderQueryDto,
  ) {
    const data = await this.ordersService.findAll(user, query);
    return {
      message: 'Successfully fetching all orders',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail order' })
  async findOne(
    @CurrentUser() user: { id: string; role: Role },
    @Param('id') id: string,
  ) {
    const data = await this.ordersService.findOne(user, id);
    return {
      message: 'Successfully fetching order',
      data,
    };
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Batalkan order sendiri' })
  async cancel(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const data = await this.ordersService.cancel(userId, id);
    return {
      message: 'Order successfully canceled',
      data,
    };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update status order' })
  async updateStatus(
    @CurrentUser() user: { id: string; role: Role },
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    const data = await this.ordersService.updateStatus(user, id, dto);
    return {
      message: 'Order status successfully updated',
      data,
    };
  }
}
