import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VerificationStatus } from 'generated/prisma/enums';
import { multerConfig } from 'src/config/multer.config';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/role.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/decorators/role.decorator';
import { Public } from 'src/shared/decorators/public.decorator';

import { CreateStoreDto } from './dto/create-store.dto';
import { ReviewStoreDto } from './dto/review-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@ApiTags('Stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Ambil daftar store' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil daftar store' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'toko' })
  @ApiQuery({
    name: 'verificationStatus',
    required: false,
    enum: VerificationStatus,
    example: VerificationStatus.APPROVED,
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('verificationStatus') verificationStatus?: VerificationStatus,
  ) {
    const data = await this.storesService.findAll({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      search,
      verificationStatus,
    });

    return {
      message: 'Successfully fetching all stores',
      data,
    };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail store' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil store' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  async findOne(@Param('id') id: string) {
    const data = await this.storesService.findOne(id);
    return {
      message: 'Successfully fetching store',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Ambil store milik user aktif' })
  async findMyStore(@CurrentUser('id') userId: string) {
    const data = await this.storesService.findMyStore(userId);
    return {
      message: 'Successfully fetching my store',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCookieAuth('access_token')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'verificationDoc', maxCount: 1 },
      ],
      multerConfig,
    ),
  )
  @ApiBody({ type: CreateStoreDto })
  @ApiOperation({ summary: 'Buat store baru untuk user aktif' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateStoreDto,
    @UploadedFiles()
    files?: {
      logo?: Express.Multer.File[];
      verificationDoc?: Express.Multer.File[];
    },
  ) {
    const data = await this.storesService.create(
      userId,
      dto,
      files?.logo?.[0],
      files?.verificationDoc?.[0],
    );

    return {
      message: 'Store successfully created',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiCookieAuth('access_token')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'logo', maxCount: 1 },
        { name: 'verificationDoc', maxCount: 1 },
      ],
      multerConfig,
    ),
  )
  @ApiBody({ type: UpdateStoreDto })
  @ApiOperation({ summary: 'Update store milik user aktif' })
  async updateMyStore(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateStoreDto,
    @UploadedFiles()
    files?: {
      logo?: Express.Multer.File[];
      verificationDoc?: Express.Multer.File[];
    },
  ) {
    const data = await this.storesService.updateMyStore(
      userId,
      dto,
      files?.logo?.[0],
      files?.verificationDoc?.[0],
    );

    return {
      message: 'Store successfully updated',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('ADMIN')
  @Patch(':id/review')
  @ApiCookieAuth('access_token')
  @ApiBody({ type: ReviewStoreDto })
  @ApiOperation({ summary: 'Review store verification' })
  @ApiParam({ name: 'id', description: 'Store ID' })
  async reviewStore(@Param('id') id: string, @Body() dto: ReviewStoreDto) {
    const data = await this.storesService.reviewStore(id, dto);
    return {
      message: 'Store verification successfully updated',
      data,
    };
  }
}
