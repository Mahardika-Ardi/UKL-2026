import { Test, TestingModule } from '@nestjs/testing';

import { InboxesController } from './inboxes.controller';
import { InboxesService } from './inboxes.service';

describe('InboxesController', () => {
  let controller: InboxesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InboxesController],
      providers: [{ provide: InboxesService, useValue: {} }],
    }).compile();

    controller = module.get<InboxesController>(InboxesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
