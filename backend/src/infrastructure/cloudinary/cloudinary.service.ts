import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, QueueEvents } from 'bullmq';
import { CloudinaryUploadResult } from 'src/jobs/processor/cloudinary.processor';
import {
  CLOUDINARY_JOBS,
  CLOUDINARY_QUEUE,
} from 'src/shared/constants/cloudinary-queue.constant';

import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CloudinaryService {
  private readonly logger: LoggerService;
  private readonly queueEvents: QueueEvents;

  constructor(
    private readonly config: ConfigService,
    @InjectQueue(CLOUDINARY_QUEUE) private readonly cloudinaryQueue: Queue,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.setContext(CloudinaryService.name);
    this.queueEvents = new QueueEvents(CLOUDINARY_QUEUE, {
      connection: {
        host: this.config.getOrThrow<string>('redis.host'),
        port: this.config.getOrThrow<number>('redis.port'),
        password: this.config.get<string>('redis.password'),
      },
    });
  }

  async queueUpload(
    file: Express.Multer.File,
  ): Promise<CloudinaryUploadResult> {
    this.logger.debug('Queuing upload job');

    const job = await this.cloudinaryQueue.add(
      CLOUDINARY_JOBS.UPLOAD,
      {
        file: {
          ...file,
          buffer: file.buffer.toString('base64'),
          mimetype: file.mimetype,
          originalname: file.originalname,
        },
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    const result = (await job.waitUntilFinished(
      this.queueEvents,
    )) as CloudinaryUploadResult;

    return result;
  }

  async queueDelete(publicId: string): Promise<void> {
    this.logger.debug('Queuing delete job', { publicId });

    await this.cloudinaryQueue.add(
      CLOUDINARY_JOBS.DELETE,
      { publicId },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    this.logger.debug('Delete job queued', { publicId });
  }
}
