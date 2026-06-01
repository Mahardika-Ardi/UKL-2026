import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartService } from './cart.service';

@ApiTags('Cart')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil cart user aktif' })
  async findAll(@CurrentUser('id') userId: string) {
    const data = await this.cartService.findAll(userId);
    return {
      message: 'Successfully fetching cart',
      data,
    };
  }

  @Post()
  @ApiOperation({ summary: 'Tambah item ke cart' })
  @ApiResponse({ status: 201, description: 'Item berhasil ditambahkan' })
  async add(@CurrentUser('id') userId: string, @Body() dto: AddCartItemDto) {
    const data = await this.cartService.add(userId, dto);
    return {
      message: 'Cart item successfully added',
      data,
    };
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Update quantity item cart' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    const data = await this.cartService.update(userId, productId, dto);
    return {
      message: 'Cart item successfully updated',
      data,
    };
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Hapus item dari cart' })
  async remove(
    @CurrentUser('id') userId: string,
    @Param('productId') productId: string,
  ) {
    const data = await this.cartService.remove(userId, productId);
    return {
      message: data,
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Kosongkan cart' })
  async clear(@CurrentUser('id') userId: string) {
    const data = await this.cartService.clear(userId);
    return {
      message: data,
    };
  }
}
