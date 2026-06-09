import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { multerConfig } from 'src/config/multer.config';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Public } from 'src/shared/decorators/public.decorator';

import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { RolesGuard } from '../auth/guards/role.guard';
import { Role } from 'src/shared/decorators/role.decorator';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Ambil daftar product' })
  async findAll(@Query() query: ProductQueryDto) {
    const data = await this.productsService.findAll(query);
    return {
      message: 'Successfully fetching all products',
      data,
    };
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Ambil detail product' })
  async findOne(@Param('id') id: string) {
    const data = await this.productsService.findOne(id);
    return {
      message: 'Successfully fetching product',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('SHOP_OWNER')
  @Post()
  @ApiCookieAuth('access_token')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiBody({ type: CreateProductDto })
  @ApiOperation({ summary: 'Buat product baru' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const data = await this.productsService.create(userId, dto, image);
    return {
      message: 'Product successfully created',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('SHOP_OWNER')
  @Patch(':id')
  @ApiCookieAuth('access_token')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiBody({ type: UpdateProductDto })
  @ApiOperation({ summary: 'Update product' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const data = await this.productsService.update(userId, id, dto, image);
    return {
      message: 'Product successfully updated',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('SHOP_OWNER')
  @Delete(':id')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Hapus product' })
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const data = await this.productsService.remove(userId, id);
    return {
      message: data,
    };
  }
}
