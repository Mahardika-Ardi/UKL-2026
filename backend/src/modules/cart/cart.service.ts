import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/infrastructure/cache/cache.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CACHE_KEYS } from 'src/shared/constants/cache-keys.constant';
import { AppError } from 'src/shared/utils/app-error.utils';

import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { cartItemSelect } from './cart-select';

const CART_CACHE_TTL = 60 * 2;

@Injectable()
export class CartService {
  private readonly logger: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.setContext(CartService.name);
  }

  private cacheKey(userId: string) {
    return `${CACHE_KEYS.USER_CART}:${userId}`;
  }

  private async invalidate(userId: string) {
    await this.cache.delByPattern(`${CACHE_KEYS.USER_CART}:${userId}`);
  }

  async findAll(userId: string) {
    const cacheKey = this.cacheKey(userId);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const items = await this.prisma.cartItem.findMany({
      where: { userId },
      select: cartItemSelect,
      orderBy: { createdAt: 'desc' },
    });

    const subtotal = items.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    const result = {
      items,
      summary: {
        itemsCount: items.length,
        totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
      },
    };

    await this.cache.set(cacheKey, result, CART_CACHE_TTL);

    return result;
  }

  async add(userId: string, dto: AddCartItemDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
      select: { id: true, stock: true, isActive: true },
    });

    if (!product || !product.isActive) {
      throw AppError.notFound('Product');
    }

    if (dto.quantity > product.stock) {
      throw AppError.badRequest({
        message: 'Quantity exceeds available stock',
      });
    }

    const item = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId,
        },
      },
      select: { quantity: true },
    });

    const quantity = (item?.quantity ?? 0) + dto.quantity;

    if (quantity > product.stock) {
      throw AppError.badRequest({
        message: 'Quantity exceeds available stock',
      });
    }

    const result = await this.prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId,
        },
      },
      create: {
        userId,
        productId: dto.productId,
        quantity: dto.quantity,
      },
      update: {
        quantity,
      },
      select: cartItemSelect,
    });

    await this.invalidate(userId);

    return result;
  }

  async update(userId: string, productId: string, dto: UpdateCartItemDto) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, stock: true, isActive: true },
    });

    if (!product || !product.isActive) {
      throw AppError.notFound('Product');
    }

    if (dto.quantity > product.stock) {
      throw AppError.badRequest({
        message: 'Quantity exceeds available stock',
      });
    }

    const item = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      select: { id: true },
    });

    if (!item) {
      throw AppError.notFound('Cart item');
    }

    const updated = await this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: dto.quantity },
      select: cartItemSelect,
    });

    await this.invalidate(userId);

    return updated;
  }

  async remove(userId: string, productId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      select: { id: true },
    });

    if (!item) {
      throw AppError.notFound('Cart item');
    }

    await this.prisma.cartItem.delete({ where: { id: item.id } });
    await this.invalidate(userId);

    return 'Cart item deleted';
  }

  async clear(userId: string) {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
    await this.invalidate(userId);

    return 'Cart cleared';
  }
}
