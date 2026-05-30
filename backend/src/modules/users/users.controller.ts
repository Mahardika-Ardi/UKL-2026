import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { multerConfig } from 'src/config/multer.config';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { Role } from 'src/shared/decorators/role.decorator';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

import { RolesGuard } from '../auth/guards/role.guard';
import { PaginationDto } from './dto/pagination.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiCookieAuth('access_token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('ADMIN')
  @Get('findall')
  @ApiOperation({ summary: 'Ambil semua user (khusus admin)' })
  @ApiBody({ type: PaginationDto, required: false })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil daftar user' })
  async findAll(@Body() query: PaginationDto) {
    const data = await this.usersService.findAll(query);
    return {
      message: 'Successfully fetching all users',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Ambil profil user yang sedang login' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil profil user' })
  async findOne(@CurrentUser('id') id: string) {
    const data = await this.usersService.findOne(id);
    return {
      message: 'Succesfully getting user',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  @ApiOperation({ summary: 'Update profil user dan avatar opsional' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Berhasil mengupdate user' })
  async update(
    @CurrentUser('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const data = await this.usersService.update(id, dto, file);
    return {
      message: 'Successfully updating user',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  @ApiOperation({ summary: 'Hapus akun user sendiri' })
  @ApiResponse({ status: 200, description: 'User berhasil dihapus' })
  async remove(@CurrentUser('id') id: string) {
    const data = await this.usersService.remove(id);
    return { message: data };
  }
}
