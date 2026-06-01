import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/infrastructure/cache/cache.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CACHE_KEYS } from 'src/shared/constants/cache-keys.constant';
import { AppError } from 'src/shared/utils/app-error.utils';
import { buildPaginationMeta } from 'src/shared/utils/pagination';

import { InboxQueryDto } from './dto/inbox-query.dto';
import { inboxSelect } from './inbox-select';

const INBOX_CACHE_TTL = 60 * 2;

@Injectable()
export class InboxesService {
  private readonly logger: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.setContext(InboxesService.name);
  }

  private cacheKey(userId: string, query: InboxQueryDto) {
    return `${CACHE_KEYS.USER_INBOXES}:${userId}:page=${query.page ?? 1}:limit=${query.limit ?? 10}:read=${query.isRead ?? ''}`;
  }

  private async invalidate(userId: string) {
    await this.cache.delByPattern(`${CACHE_KEYS.USER_INBOXES}:${userId}`);
  }

  async findAll(userId: string, query: InboxQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const cacheKey = this.cacheKey(userId, query);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const where = {
      userId,
      ...(typeof query.isRead === 'string'
        ? { isRead: query.isRead === 'true' }
        : {}),
    };

    const [inboxes, total] = await this.prisma.$transaction([
      this.prisma.inbox.findMany({
        where,
        select: inboxSelect,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inbox.count({ where }),
    ]);

    const result = {
      inboxes,
      meta: buildPaginationMeta(total, page, limit),
    };

    await this.cache.set(cacheKey, result, INBOX_CACHE_TTL);

    return result;
  }

  async findOne(userId: string, id: string) {
    const inbox = await this.prisma.inbox.findFirst({
      where: { id, userId },
      select: inboxSelect,
    });

    if (!inbox) {
      throw AppError.notFound('Inbox');
    }

    return inbox;
  }

  async markAsRead(userId: string, id: string) {
    const inbox = await this.prisma.inbox.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!inbox) {
      throw AppError.notFound('Inbox');
    }

    const updated = await this.prisma.inbox.update({
      where: { id },
      data: { isRead: true },
      select: inboxSelect,
    });

    await this.invalidate(userId);

    return updated;
  }

  async markAllAsRead(userId: string) {
    await this.prisma.inbox.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });

    await this.invalidate(userId);

    return 'All inbox messages marked as read';
  }

  async remove(userId: string, id: string) {
    const inbox = await this.prisma.inbox.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!inbox) {
      throw AppError.notFound('Inbox');
    }

    await this.prisma.inbox.delete({ where: { id } });
    await this.invalidate(userId);

    return 'Inbox deleted';
  }
}
