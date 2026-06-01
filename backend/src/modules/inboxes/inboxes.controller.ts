import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';

import { InboxQueryDto } from './dto/inbox-query.dto';
import { InboxesService } from './inboxes.service';

@ApiTags('Inboxes')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard)
@Controller('inboxes')
export class InboxesController {
  constructor(private readonly inboxesService: InboxesService) {}

  @Get()
  @ApiOperation({ summary: 'Ambil inbox user aktif' })
  async findAll(
    @CurrentUser('id') userId: string,
    @Query() query: InboxQueryDto,
  ) {
    const data = await this.inboxesService.findAll(userId, query);
    return {
      message: 'Successfully fetching inboxes',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ambil detail inbox' })
  async findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const data = await this.inboxesService.findOne(userId, id);
    return {
      message: 'Successfully fetching inbox',
      data,
    };
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Tandai inbox sudah dibaca' })
  async markAsRead(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const data = await this.inboxesService.markAsRead(userId, id);
    return {
      message: 'Inbox successfully updated',
      data,
    };
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Tandai semua inbox sudah dibaca' })
  async markAllAsRead(@CurrentUser('id') userId: string) {
    const data = await this.inboxesService.markAllAsRead(userId);
    return {
      message: data,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Hapus inbox' })
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const data = await this.inboxesService.remove(userId, id);
    return {
      message: data,
    };
  }
}
