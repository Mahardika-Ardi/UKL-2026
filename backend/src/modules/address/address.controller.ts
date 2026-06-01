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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@ApiTags('Address')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @ApiBody({ type: CreateAddressDto })
  @ApiOperation({ summary: 'Tambah alamat pengguna aktif' })
  @ApiResponse({ status: 201, description: 'Alamat berhasil ditambahkan' })
  async create(
    @Body() createAddressDto: CreateAddressDto,
    @CurrentUser('id') id: string,
  ) {
    const data = await this.addressService.create(id, createAddressDto);
    return {
      message: 'Address successfully added',
      data,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Ambil semua alamat pengguna aktif' })
  @ApiResponse({ status: 200, description: 'Daftar alamat berhasil diambil' })
  async findAll(@CurrentUser('id') id: string) {
    const data = await this.addressService.findAll(id);
    return {
      message: 'Successfully fetching all addresses',
      data,
    };
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiOperation({ summary: 'Ambil detail alamat pengguna aktif' })
  @ApiResponse({ status: 200, description: 'Alamat berhasil diambil' })
  async findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const data = await this.addressService.findOne(userId, id);
    return {
      message: 'Successfully fetching address',
      data,
    };
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiBody({ type: UpdateAddressDto })
  @ApiOperation({ summary: 'Update alamat pengguna aktif' })
  @ApiResponse({ status: 200, description: 'Alamat berhasil diperbarui' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const data = await this.addressService.update(userId, id, updateAddressDto);
    return {
      message: 'Successfully updating address',
      data,
    };
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiOperation({ summary: 'Hapus alamat pengguna aktif' })
  @ApiResponse({ status: 200, description: 'Alamat berhasil dihapus' })
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const data = await this.addressService.remove(userId, id);
    return {
      message: data,
    };
  }
}
