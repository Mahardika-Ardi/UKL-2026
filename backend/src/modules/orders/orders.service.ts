import { Injectable } from '@nestjs/common';
import { InboxType, OrderStatus, Role } from 'generated/prisma/enums';
import { CacheService } from 'src/infrastructure/cache/cache.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CACHE_KEYS } from 'src/shared/constants/cache-keys.constant';
import { AppError } from 'src/shared/utils/app-error.utils';
import { buildPaginationMeta } from 'src/shared/utils/pagination';

import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { orderDetailSelect, orderListSelect } from './order-select';

const ORDER_CACHE_TTL = 60 * 2;

type UserContext = {
  id: string;
  role: Role;
};

@Injectable()
export class OrdersService {
  private readonly logger: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.setContext(OrdersService.name);
  }

  private userCacheKey(userId: string, role: Role, query: OrderQueryDto) {
    return `${CACHE_KEYS.USER_ORDERS}:${userId}:role=${role}:page=${query.page ?? 1}:limit=${query.limit ?? 10}:status=${query.status ?? ''}:store=${query.storeId ?? ''}`;
  }

  private async invalidateOrderCaches(): Promise<void> {
    await this.cache.delByPattern(CACHE_KEYS.USER_ORDERS);
    await this.cache.delByPattern(CACHE_KEYS.STORE_ORDERS);
  }

  private inboxTypeByStatus(status: OrderStatus): InboxType {
    switch (status) {
      case OrderStatus.PAID:
        return InboxType.ORDER_PAID;
      case OrderStatus.PROCESSING:
        return InboxType.ORDER_PROCESSING;
      case OrderStatus.DONE:
        return InboxType.ORDER_DONE;
      case OrderStatus.CANCELED:
        return InboxType.ORDER_CANCELED;
      default:
        return InboxType.ORDER_PLACED;
    }
  }

  private async createInbox(
    userId: string,
    orderId: string,
    status: OrderStatus,
  ) {
    await this.prisma.inbox.create({
      data: {
        userId,
        orderId,
        type: this.inboxTypeByStatus(status),
        title: `Order ${status.toLowerCase()}`,
        body: `Your order has been updated to ${status.toLowerCase()}.`,
      },
    });
  }

  async create(userId: string, dto: CreateOrderDto) {
    const address = await this.prisma.address.findFirst({
      where: { id: dto.addressId, userId },
      select: { id: true },
    });

    if (!address) {
      throw AppError.notFound('Address');
    }

    const store = await this.prisma.store.findUnique({
      where: { id: dto.storeId },
      select: { id: true, ownerId: true, name: true },
    });

    if (!store) {
      throw AppError.notFound('Store');
    }

    const cartItems = await this.prisma.cartItem.findMany({
      where: {
        userId,
        product: { storeId: dto.storeId, isActive: true },
      },
      select: {
        id: true,
        productId: true,
        quantity: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
          },
        },
      },
    });

    if (cartItems.length === 0) {
      throw AppError.badRequest({
        message: 'Cart is empty for this store',
      });
    }

    for (const item of cartItems) {
      if (item.quantity > item.product.stock) {
        throw AppError.badRequest({
          message: `Stock is insufficient for ${item.product.name}`,
        });
      }
    }

    const subtotal = cartItems.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);
    const totalAmount = subtotal + dto.shippingFee;

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId,
          storeId: dto.storeId,
          addressId: dto.addressId,
          paymentMethod: dto.paymentMethod,
          shippingFee: dto.shippingFee,
          totalAmount,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              productPrice: item.product.price,
              quantity: item.quantity,
              subtotal: Number(item.product.price) * item.quantity,
            })),
          },
        },
        select: orderDetailSelect,
      });

      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      await tx.cartItem.deleteMany({
        where: {
          userId,
          productId: { in: cartItems.map((item) => item.productId) },
        },
      });

      await tx.inbox.create({
        data: {
          userId,
          orderId: created.id,
          type: InboxType.ORDER_PLACED,
          title: 'Order placed',
          body: `Your order in ${store.name} has been placed successfully.`,
        },
      });

      return created;
    });

    await this.invalidateOrderCaches();
    await this.cache.delByPattern(CACHE_KEYS.USER_CART);
    await this.cache.delByPattern(CACHE_KEYS.ALL_PRODUCTS);
    await this.cache.delByPattern(CACHE_KEYS.PRODUCT_DETAIL);
    await this.cache.delByPattern(`${CACHE_KEYS.USER_INBOXES}:${userId}`);

    this.logger.log('Order created', { userId, orderId: order.id });

    return order;
  }

  async findAll(user: UserContext, query: OrderQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const cacheKey = this.userCacheKey(user.id, user.role, query);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const ownedStore =
      user.role === Role.SHOP_OWNER
        ? await this.prisma.store.findUnique({
            where: { ownerId: user.id },
            select: { id: true },
          })
        : null;

    const baseWhere =
      user.role === Role.ADMIN
        ? {
            ...(query.status ? { status: query.status } : {}),
            ...(query.storeId ? { storeId: query.storeId } : {}),
          }
        : user.role === Role.SHOP_OWNER
          ? {
              ...(query.status ? { status: query.status } : {}),
              storeId: ownedStore?.id ?? '__no_store__',
            }
          : {
              userId: user.id,
              ...(query.status ? { status: query.status } : {}),
              ...(query.storeId ? { storeId: query.storeId } : {}),
            };

    const [orders, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: baseWhere,
        select: orderListSelect,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where: baseWhere }),
    ]);

    const result = {
      orders,
      meta: buildPaginationMeta(total, page, limit),
    };

    await this.cache.set(cacheKey, result, ORDER_CACHE_TTL);

    return result;
  }

  async findOne(user: UserContext, id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: orderDetailSelect,
    });

    if (!order) {
      throw AppError.notFound('Order');
    }

    const canAccess =
      user.role === Role.ADMIN ||
      order.userId === user.id ||
      (user.role === Role.SHOP_OWNER && order.store.ownerId === user.id);

    if (!canAccess) {
      throw AppError.forbidden({
        message: 'You are not allowed to access this order',
      });
    }

    return order;
  }

  async cancel(userId: string, id: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, userId },
      select: {
        id: true,
        status: true,
        items: {
          select: {
            productId: true,
            quantity: true,
          },
        },
      },
    });

    if (!order) {
      throw AppError.notFound('Order');
    }

    if (order.status !== OrderStatus.UNPAID) {
      throw AppError.badRequest({
        message: 'Only unpaid order can be canceled',
      });
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      const canceled = await tx.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELED },
        select: orderDetailSelect,
      });

      await tx.inbox.create({
        data: {
          userId,
          orderId: id,
          type: InboxType.ORDER_CANCELED,
          title: 'Order canceled',
          body: 'Your order has been canceled successfully.',
        },
      });

      return canceled;
    });

    await this.invalidateOrderCaches();
    await this.cache.delByPattern(CACHE_KEYS.ALL_PRODUCTS);
    await this.cache.delByPattern(CACHE_KEYS.PRODUCT_DETAIL);
    await this.cache.delByPattern(`${CACHE_KEYS.USER_INBOXES}:${userId}`);

    return updated;
  }

  async updateStatus(user: UserContext, id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        userId: true,
        store: {
          select: {
            ownerId: true,
          },
        },
        items: {
          select: {
            productId: true,
            quantity: true,
          },
        },
      },
    });

    if (!order) {
      throw AppError.notFound('Order');
    }

    const canUpdate =
      user.role === Role.ADMIN ||
      (user.role === Role.SHOP_OWNER && order.store.ownerId === user.id);

    if (!canUpdate) {
      throw AppError.forbidden({
        message: 'You are not allowed to update this order',
      });
    }

    if (order.status === dto.status) {
      return this.findOne(user, id);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      if (
        dto.status === OrderStatus.CANCELED &&
        order.status !== OrderStatus.CANCELED
      ) {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      if (dto.status === OrderStatus.DONE) {
        const soldCount = order.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        await tx.store.update({
          where: { ownerId: order.store.ownerId },
          data: { totalSold: { increment: soldCount } },
        });
      }

      const result = await tx.order.update({
        where: { id },
        data: { status: dto.status },
        select: orderDetailSelect,
      });

      await tx.inbox.create({
        data: {
          userId: order.userId,
          orderId: id,
          type: this.inboxTypeByStatus(dto.status),
          title: `Order ${dto.status.toLowerCase()}`,
          body: `Your order has been updated to ${dto.status.toLowerCase()}.`,
        },
      });

      return result;
    });

    await this.invalidateOrderCaches();
    await this.cache.delByPattern(CACHE_KEYS.ALL_PRODUCTS);
    await this.cache.delByPattern(CACHE_KEYS.PRODUCT_DETAIL);
    await this.cache.delByPattern(`${CACHE_KEYS.USER_INBOXES}:${order.userId}`);

    return updated;
  }
}
