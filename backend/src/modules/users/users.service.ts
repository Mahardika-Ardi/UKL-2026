import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/infrastructure/cache/cache.service';
import { CloudinaryService } from 'src/infrastructure/cloudinary/cloudinary.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { CACHE_KEYS } from 'src/shared/constants/cache-keys.constant';
import { AppError } from 'src/shared/utils/app-error.utils';
import { buildPaginationMeta } from 'src/shared/utils/pagination';

import { PaginationDto } from './dto/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userAdminSelect, userMeSelect } from './user-select';

const CACHE_TTL = 60 * 5;

@Injectable()
export class UsersService {
  private logger: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly cloudinary: CloudinaryService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.setContext(UsersService.name);
  }

  private async invalidateUsersCache(): Promise<void> {
    await this.cache.delByPattern(CACHE_KEYS.ALL_USERS);
    this.logger.debug('Users cache invalidated');
  }

  async findAll(query: PaginationDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const cacheKey = `${CACHE_KEYS.ALL_USERS}:page=${page}:limit${limit}:search=${search ?? ''}`;

    this.logger.log('Fetching all users');

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      this.logger.debug('Users served from cache', { cacheKey });
      return cached;
    }

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};
    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: userAdminSelect,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    if (!users && !total) {
      this.logger.warn('Failed fetching users');
      throw AppError.notFound('Account', { message: 'Users not found' });
    }

    const result = {
      users,
      meta: buildPaginationMeta(total, page, limit),
    };

    await this.cache.set(cacheKey, result, CACHE_TTL);

    this.logger.log('Users fetched from DB and cached', {
      count: users.length,
      total,
      page,
    });

    return result;
  }

  async findOne(id: string) {
    this.logger.log('Fetching user');

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userMeSelect,
    });

    if (!user) {
      this.logger.warn('Failed fetching user', { userId: id });
      throw AppError.notFound('Account', { message: 'User not found' });
    }

    this.logger.log('User fetched', { userId: id });

    return user;
  }

  async update(id: string, dto: UpdateUserDto, file?: Express.Multer.File) {
    this.logger.log('Updating user', { userId: id });

    let oldPublicId: string | null = null;

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { avatarPublicId: true },
    });

    oldPublicId = user?.avatarPublicId ?? null;

    if (file) {
      this.logger.debug('Queuing avatar to upload', { userId: id });

      const uploadResult = await this.cloudinary.queueUpload(file);

      dto.avatarUrl = uploadResult.url;
      dto.avatarPublicId = uploadResult.public_id;

      this.logger.debug('Avatar uploaded', {
        userId: id,
        publicId: uploadResult.public_id,
      });
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dto,
      select: userMeSelect,
    });

    if (file && oldPublicId) {
      void this.cloudinary.queueDelete(oldPublicId);
      this.logger.debug('Deleting old avatar from Cloudinary', {
        userId: id,
        oldPublicId,
      });
    }

    await this.invalidateUsersCache();

    this.logger.debug('Cache invalidated after user updated', { userId: id });
    this.logger.log('User updated', {
      userId: id,
      hasNewAvatar: !!file,
    });

    return updatedUser;
  }

  async remove(id: string) {
    this.logger.log('Deleting user', { userId: id });

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, avatarPublicId: true },
    });

    if (user?.avatarPublicId) {
      void this.cloudinary.queueDelete(user.avatarPublicId);
      this.logger.debug('Deleting avatar from cloudinary', {
        userId: id,
        publicId: user.avatarPublicId,
      });
    }

    await this.prisma.user.delete({ where: { id } });
    await this.invalidateUsersCache();
    this.logger.debug('Cache invalidated after user deleted', { userId: id });
    this.logger.log('User deleted', { userId: id });

    return 'User deleted';
  }
}
