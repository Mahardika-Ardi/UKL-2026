import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/infrastructure/cache/cache.service';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CACHE_KEYS } from 'src/shared/constants/cache-keys.constant';
import { AppError } from 'src/shared/utils/app-error.utils';
import { buildPaginationMeta } from 'src/shared/utils/pagination';

import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { productOwnerSelect, productPublicSelect } from './product-select';

const PRODUCT_CACHE_TTL = 60 * 5;

@Injectable()
export class ProductsService {
  private readonly logger: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly cloudinary: CloudinaryService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.setContext(ProductsService.name);
  }

  private async invalidateProductsCache(): Promise<void> {
    await this.cache.delByPattern(CACHE_KEYS.ALL_PRODUCTS);
    await this.cache.delByPattern(CACHE_KEYS.PRODUCT_DETAIL);
  }

  private async recalculateStoreRating(storeId: string) {
    const products = await this.prisma.product.findMany({
      where: { storeId },
      select: { id: true },
    });

    const productIds = products.map((item) => item.id);
    const reviews = productIds.length
      ? await this.prisma.review.findMany({
          where: { productId: { in: productIds } },
          select: { rating: true },
        })
      : [];

    const count = reviews.length;
    const rating =
      count === 0
        ? 0
        : reviews.reduce((sum, item) => sum + item.rating, 0) / count;

    await this.prisma.store.update({
      where: { id: storeId },
      data: {
        rating,
        ratingCount: count,
      },
    });
  }

  async create(
    userId: string,
    dto: CreateProductDto,
    image?: Express.Multer.File,
  ) {
    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId },
      select: { id: true },
    });

    if (!store) {
      throw AppError.forbidden({
        message: 'Only store owner can create product',
      });
    }

    const imageResult = image ? await this.cloudinary.queueUpload(image) : null;

    const product = await this.prisma.product.create({
      data: {
        storeId: store.id,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        stock: dto.stock ?? 0,
        imageUrl: imageResult?.url ?? null,
        imagePublicId: imageResult?.public_id ?? null,
        isActive: dto.isActive ?? true,
      },
      select: productOwnerSelect,
    });

    await this.invalidateProductsCache();

    return product;
  }

  async findAll(query: ProductQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const search = query.search;
    const storeId = query.storeId;
    const isActive =
      typeof query.isActive === 'string'
        ? query.isActive === 'true'
        : undefined;

    const cacheKey = `${CACHE_KEYS.ALL_PRODUCTS}:page=${page}:limit=${limit}:search=${search ?? ''}:store=${storeId ?? ''}:active=${isActive ?? ''}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const where = {
      ...(storeId ? { storeId } : {}),
      ...(typeof isActive === 'boolean' ? { isActive } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              {
                description: {
                  contains: search,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    };

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        select: productPublicSelect,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    const result = {
      products,
      meta: buildPaginationMeta(total, page, limit),
    };

    await this.cache.set(cacheKey, result, PRODUCT_CACHE_TTL);

    return result;
  }

  async findOne(id: string) {
    const cacheKey = `${CACHE_KEYS.PRODUCT_DETAIL}:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const product = await this.prisma.product.findUnique({
      where: { id },
      select: productPublicSelect,
    });

    if (!product) {
      throw AppError.notFound('Product');
    }

    await this.cache.set(cacheKey, product, PRODUCT_CACHE_TTL);

    return product;
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateProductDto,
    image?: Express.Multer.File,
  ) {
    const product = await this.prisma.product.findFirst({
      where: { id, store: { ownerId: userId } },
      select: { id: true, imagePublicId: true },
    });

    if (!product) {
      throw AppError.notFound('Product', {
        message: 'Product not found for this user',
      });
    }

    const imageResult = image ? await this.cloudinary.queueUpload(image) : null;

    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        ...(imageResult
          ? {
              imageUrl: imageResult.url,
              imagePublicId: imageResult.public_id,
            }
          : {}),
      },
      select: productOwnerSelect,
    });

    if (imageResult && product.imagePublicId) {
      void this.cloudinary.queueDelete(product.imagePublicId);
    }

    await this.invalidateProductsCache();

    return updated;
  }

  async remove(userId: string, id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, store: { ownerId: userId } },
      select: { id: true, imagePublicId: true, storeId: true },
    });

    if (!product) {
      throw AppError.notFound('Product');
    }

    await this.prisma.product.delete({ where: { id } });

    if (product.imagePublicId) {
      void this.cloudinary.queueDelete(product.imagePublicId);
    }

    await this.recalculateStoreRating(product.storeId);
    await this.invalidateProductsCache();

    return 'Product deleted';
  }
}
