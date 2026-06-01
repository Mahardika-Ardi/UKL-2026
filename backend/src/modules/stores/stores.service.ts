import { Injectable } from '@nestjs/common';
import { Role, VerificationStatus } from 'generated/prisma/enums';
import { CacheService } from 'src/infrastructure/cache/cache.service';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CACHE_KEYS } from 'src/shared/constants/cache-keys.constant';
import { AppError } from 'src/shared/utils/app-error.utils';
import { buildPaginationMeta } from 'src/shared/utils/pagination';

import { CreateStoreDto } from './dto/create-store.dto';
import { ReviewStoreDto } from './dto/review-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { storeOwnerSelect, storePublicSelect } from './store-select';

const STORE_CACHE_TTL = 60 * 5;

@Injectable()
export class StoresService {
  private readonly logger: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly cloudinary: CloudinaryService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.setContext(StoresService.name);
  }

  private async invalidateStoresCache(): Promise<void> {
    await this.cache.delByPattern(CACHE_KEYS.ALL_STORES);
    await this.cache.delByPattern(CACHE_KEYS.STORE_DETAIL);
  }

  async create(
    userId: string,
    dto: CreateStoreDto,
    logo?: Express.Multer.File,
    verificationDoc?: Express.Multer.File,
  ) {
    const existing = await this.prisma.store.findUnique({
      where: { ownerId: userId },
      select: { id: true },
    });

    if (existing) {
      throw AppError.conflict('Store', {
        message: 'User already has a store',
      });
    }

    if (!verificationDoc) {
      throw AppError.badRequest({
        message: 'Verification document is required',
      });
    }

    const [logoResult, docResult] = await Promise.all([
      logo ? this.cloudinary.queueUpload(logo) : Promise.resolve(null),
      this.cloudinary.queueUpload(verificationDoc),
    ]);

    const store = await this.prisma.$transaction(async (tx) => {
      const created = await tx.store.create({
        data: {
          ownerId: userId,
          ...dto,
          logoUrl: logoResult?.url ?? null,
          logoPublicId: logoResult?.public_id ?? null,
          verificationDocUrl: docResult.url,
          verificationDocPublicId: docResult.public_id,
        },
        select: storeOwnerSelect,
      });

      await tx.user.update({
        where: { id: userId },
        data: { role: Role.SHOP_OWNER },
      });

      return created;
    });

    await this.invalidateStoresCache();

    this.logger.log('Store created', { userId, storeId: store.id });

    return store;
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    verificationStatus?: VerificationStatus;
  }) {
    const { page = 1, limit = 10, search, verificationStatus } = query;
    const skip = (page - 1) * limit;

    const cacheKey = `${CACHE_KEYS.ALL_STORES}:page=${page}:limit=${limit}:search=${search ?? ''}:status=${verificationStatus ?? ''}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const where = {
      ...(verificationStatus ? { verificationStatus } : {}),
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

    const [stores, total] = await this.prisma.$transaction([
      this.prisma.store.findMany({
        where,
        select: storePublicSelect,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.store.count({ where }),
    ]);

    const result = {
      stores,
      meta: buildPaginationMeta(total, page, limit),
    };

    await this.cache.set(cacheKey, result, STORE_CACHE_TTL);

    return result;
  }

  async findOne(id: string) {
    const cacheKey = `${CACHE_KEYS.STORE_DETAIL}:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const store = await this.prisma.store.findUnique({
      where: { id },
      select: storePublicSelect,
    });

    if (!store) {
      throw AppError.notFound('Store');
    }

    await this.cache.set(cacheKey, store, STORE_CACHE_TTL);
    return store;
  }

  async findMyStore(userId: string) {
    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId },
      select: storeOwnerSelect,
    });

    if (!store) {
      throw AppError.notFound('Store', {
        message: 'Store not found for this user',
      });
    }

    return store;
  }

  async updateMyStore(
    userId: string,
    dto: UpdateStoreDto,
    logo?: Express.Multer.File,
    verificationDoc?: Express.Multer.File,
  ) {
    const store = await this.prisma.store.findUnique({
      where: { ownerId: userId },
      select: { id: true, logoPublicId: true, verificationDocPublicId: true },
    });

    if (!store) {
      throw AppError.notFound('Store', {
        message: 'Store not found for this user',
      });
    }

    const [logoResult, docResult] = await Promise.all([
      logo ? this.cloudinary.queueUpload(logo) : Promise.resolve(null),
      verificationDoc
        ? this.cloudinary.queueUpload(verificationDoc)
        : Promise.resolve(null),
    ]);

    const updated = await this.prisma.store.update({
      where: { id: store.id },
      data: {
        ...dto,
        ...(logoResult
          ? {
              logoUrl: logoResult.url,
              logoPublicId: logoResult.public_id,
            }
          : {}),
        ...(docResult
          ? {
              verificationDocUrl: docResult.url,
              verificationDocPublicId: docResult.public_id,
              verificationStatus: VerificationStatus.PENDING,
              verifiedAt: null,
              rejectedReason: null,
            }
          : {}),
      },
      select: storeOwnerSelect,
    });

    if (logoResult && store.logoPublicId) {
      void this.cloudinary.queueDelete(store.logoPublicId);
    }

    if (docResult && store.verificationDocPublicId) {
      void this.cloudinary.queueDelete(store.verificationDocPublicId);
    }

    await this.invalidateStoresCache();

    return updated;
  }

  async reviewStore(id: string, dto: ReviewStoreDto) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!store) {
      throw AppError.notFound('Store');
    }

    const updated = await this.prisma.store.update({
      where: { id },
      data:
        dto.status === VerificationStatus.APPROVED
          ? {
              verificationStatus: dto.status,
              verifiedAt: new Date(),
              rejectedReason: null,
            }
          : {
              verificationStatus: dto.status,
              verifiedAt: null,
              rejectedReason: dto.rejectedReason,
            },
      select: storeOwnerSelect,
    });

    await this.invalidateStoresCache();

    return updated;
  }
}
