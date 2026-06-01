import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Public } from 'src/shared/decorators/public.decorator';

import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewQueryDto } from './dto/review-query.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get('product/:productId')
  @ApiOperation({ summary: 'Ambil review per product' })
  async findAll(
    @Param('productId') productId: string,
    @Query() query: ReviewQueryDto,
  ) {
    const data = await this.reviewsService.findAll(productId, query);
    return {
      message: 'Successfully fetching reviews',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Ambil review milik user aktif' })
  async findMyReviews(
    @CurrentUser('id') userId: string,
    @Query() query: ReviewQueryDto,
  ) {
    const data = await this.reviewsService.findMyReviews(userId, query);
    return {
      message: 'Successfully fetching my reviews',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Buat review baru' })
  @ApiResponse({ status: 201, description: 'Review berhasil dibuat' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateReviewDto,
  ) {
    const data = await this.reviewsService.create(userId, dto);
    return {
      message: 'Review successfully created',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Update review milik user aktif' })
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    const data = await this.reviewsService.update(userId, id, dto);
    return {
      message: 'Review successfully updated',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiCookieAuth('access_token')
  @ApiOperation({ summary: 'Hapus review milik user aktif' })
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const data = await this.reviewsService.remove(userId, id);
    return {
      message: data,
    };
  }
}
