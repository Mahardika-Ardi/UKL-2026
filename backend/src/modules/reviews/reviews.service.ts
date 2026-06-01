import { Injectable } from '@nestjs/common';
import { OrderStatus } from 'generated/prisma/enums';
import { CacheService } from 'src/infrastructure/cache/cache.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CACHE_KEYS } from 'src/shared/constants/cache-keys.constant';
import { AppError } from 'src/shared/utils/app-error.utils';
import { buildPaginationMeta } from 'src/shared/utils/pagination';

import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewQueryDto } from './dto/review-query.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { reviewSelect } from './review-select';

const REVIEW_CACHE_TTL = 60 * 2;

@Injectable()
export class ReviewsService {
  private readonly logger: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.setContext(ReviewsService.name);
  }

  private cacheKey(productId: string, page: number, limit: number) {
    return `${CACHE_KEYS.PRODUCT_REVIEWS}:${productId}:page=${page}:limit=${limit}`;
  }

  private async invalidate(productId: string, userId: string) {
    await this.cache.delByPattern(`${CACHE_KEYS.PRODUCT_REVIEWS}:${productId}`);
    await this.cache.delByPattern(`${CACHE_KEYS.USER_REVIEWS}:${userId}`);
    await this.cache.delByPattern(CACHE_KEYS.ALL_PRODUCTS);
    await this.cache.delByPattern(CACHE_KEYS.PRODUCT_DETAIL);
    await this.cache.delByPattern(CACHE_KEYS.ALL_STORES);
    await this.cache.delByPattern(CACHE_KEYS.STORE_DETAIL);
  }

  private async recalculateRatings(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { storeId: true },
    });

    if (!product) return;

    const [productReviews, storeProducts] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId },
        select: { rating: true },
      }),
      this.prisma.product.findMany({
        where: { storeId: product.storeId },
        select: { id: true },
      }),
    ]);

    const productCount = productReviews.length;
    const productRating =
      productCount === 0
        ? 0
        : productReviews.reduce((sum, item) => sum + item.rating, 0) /
          productCount;

    await this.prisma.product.update({
      where: { id: productId },
      data: {
        rating: productRating,
        ratingCount: productCount,
      },
    });

    const storeReviewIds = storeProducts.map((item) => item.id);
    const storeReviews = storeReviewIds.length
      ? await this.prisma.review.findMany({
          where: { productId: { in: storeReviewIds } },
          select: { rating: true },
        })
      : [];

    const storeCount = storeReviews.length;
    const storeRating =
      storeCount === 0
        ? 0
        : storeReviews.reduce((sum, item) => sum + item.rating, 0) / storeCount;

    await this.prisma.store.update({
      where: { id: product.storeId },
      data: {
        rating: storeRating,
        ratingCount: storeCount,
      },
    });
  }

  async create(userId: string, dto: CreateReviewDto) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: dto.orderId,
        userId,
        status: OrderStatus.DONE,
      },
      select: {
        id: true,
        items: {
          select: {
            productId: true,
          },
        },
      },
    });

    if (!order) {
      throw AppError.badRequest({
        message: 'Order is not eligible for review',
      });
    }

    const ownedProduct = order.items.some(
      (item) => item.productId === dto.productId,
    );
    if (!ownedProduct) {
      throw AppError.forbidden({
        message: 'Product not found in this order',
      });
    }

    const existing = await this.prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId,
        },
      },
      select: { id: true },
    });

    if (existing) {
      throw AppError.conflict('Review', {
        message: 'Review already exists for this product',
      });
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        productId: dto.productId,
        orderId: dto.orderId,
        rating: dto.rating,
        comment: dto.comment,
      },
      select: reviewSelect,
    });

    await this.recalculateRatings(dto.productId);
    await this.invalidate(dto.productId, userId);

    return review;
  }

  async findAll(productId: string, query: ReviewQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const cacheKey = this.cacheKey(productId, page, limit);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const where = { productId };
    const [reviews, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        select: reviewSelect,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where }),
    ]);

    const result = {
      reviews,
      meta: buildPaginationMeta(total, page, limit),
    };

    await this.cache.set(cacheKey, result, REVIEW_CACHE_TTL);

    return result;
  }

  async findMyReviews(userId: string, query: ReviewQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const cacheKey = `${CACHE_KEYS.USER_REVIEWS}:${userId}:page=${page}:limit=${limit}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const where = {
      userId,
      ...(query.productId ? { productId: query.productId } : {}),
    };
    const [reviews, total] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        select: reviewSelect,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where }),
    ]);

    const result = {
      reviews,
      meta: buildPaginationMeta(total, page, limit),
    };

    await this.cache.set(cacheKey, result, REVIEW_CACHE_TTL);

    return result;
  }

  async update(userId: string, id: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findFirst({
      where: { id, userId },
      select: { productId: true },
    });

    if (!review) {
      throw AppError.notFound('Review');
    }

    const updated = await this.prisma.review.update({
      where: { id },
      data: {
        ...(dto.rating ? { rating: dto.rating } : {}),
        ...(dto.comment !== undefined ? { comment: dto.comment } : {}),
      },
      select: reviewSelect,
    });

    await this.recalculateRatings(review.productId);
    await this.invalidate(review.productId, userId);

    return updated;
  }

  async remove(userId: string, id: string) {
    const review = await this.prisma.review.findFirst({
      where: { id, userId },
      select: { productId: true },
    });

    if (!review) {
      throw AppError.notFound('Review');
    }

    await this.prisma.review.delete({ where: { id } });

    await this.recalculateRatings(review.productId);
    await this.invalidate(review.productId, userId);

    return 'Review deleted';
  }
}
