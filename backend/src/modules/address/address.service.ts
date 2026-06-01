import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { AppError } from 'src/shared/utils/app-error.utils';

import { addressSelect, addressSelectCreate } from './address-select';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  private logger: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.setContext(AddressService.name);
  }

  async create(id: string, createAddressDto: CreateAddressDto) {
    const address = await this.prisma.address.create({
      data: { ...createAddressDto, userId: id },
      select: addressSelectCreate,
    });

    if (!address) {
      this.logger.warn('Failed adding address', { userId: id });
      throw AppError.badRequest({ message: 'Failed adding address to user' });
    }

    this.logger.log('Address added', { userId: id });

    return address;
  }

  async findAll(id: string) {
    this.logger.log('Fetching all address', { userId: id });

    const address = await this.prisma.address.findMany({
      where: { userId: id },
      select: addressSelect,
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    if (!address) {
      this.logger.warn('Failed fetching all address', { userId: id });
      throw AppError.notFound('Address', { message: 'Address not found' });
    }

    this.logger.log('Address fetched', {
      userId: id,
      count: address.length,
    });

    return address;
  }

  async findOne(userId: string, id: string) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
      select: addressSelect,
    });

    if (!address) {
      this.logger.warn('Address not found', { userId, addressId: id });
      throw AppError.notFound('Address');
    }

    return address;
  }

  async update(userId: string, id: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!address) {
      this.logger.warn('Update address failed', { userId, addressId: id });
      throw AppError.notFound('Address');
    }

    const updated = await this.prisma.address.update({
      where: { id },
      data: updateAddressDto,
      select: addressSelect,
    });

    this.logger.log('Address updated', { userId, addressId: id });

    return updated;
  }

  async remove(userId: string, id: string) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
      select: { id: true },
    });

    if (!address) {
      this.logger.warn('Delete address failed', { userId, addressId: id });
      throw AppError.notFound('Address');
    }

    await this.prisma.address.delete({ where: { id } });

    this.logger.log('Address deleted', { userId, addressId: id });

    return 'Address deleted';
  }
}
