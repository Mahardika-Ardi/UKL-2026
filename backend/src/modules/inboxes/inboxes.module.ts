import { Module } from '@nestjs/common';

import { InboxesController } from './inboxes.controller';
import { InboxesService } from './inboxes.service';

@Module({
  controllers: [InboxesController],
  providers: [InboxesService],
})
export class InboxesModule {}
