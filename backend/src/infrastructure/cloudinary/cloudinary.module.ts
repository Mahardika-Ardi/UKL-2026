import { BullModule } from '@nestjs/bullmq';
import { Global, Module, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryProcessor } from 'src/jobs/processor/cloudinary.processor';
import { CLOUDINARY_QUEUE } from 'src/shared/constants/cloudinary-queue.constant';

import { CloudinaryService } from './cloudinary.service';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: CLOUDINARY_QUEUE,
    }),
  ],
  providers: [CloudinaryService, CloudinaryProcessor],
  exports: [CloudinaryService],
})
export class CloudinaryModule implements OnModuleInit {
  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    cloudinary.config({
      cloud_name: this.config.getOrThrow<string>('cloudinary.name'),
      api_key: this.config.getOrThrow<string>('cloudinary.apiKey'),
      api_secret: this.config.getOrThrow<string>('cloudinary.apiSecret'),
    });
  }
}
