import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from '../../config/cloudinary.config';
import {
  CLOUDINARY_JOBS,
  CLOUDINARY_QUEUE,
} from '../../shared/constants/cloudinary-queue.constant';
import { LoggerService } from 'src/infrastructure/logger/logger.service';

type UploadJob = {
  file: Omit<Express.Multer.File, 'buffer'> & { buffer: string };
};

type DeleteJob = {
  publicId: string;
};

export type CloudinaryUploadResult = {
  url: string;
  public_id: string;
};

@Processor(CLOUDINARY_QUEUE)
export class CloudinaryProcessor extends WorkerHost {
  private readonly logger: LoggerService;

  constructor(private readonly loggerService: LoggerService) {
    super();
    this.logger = loggerService.setContext(CloudinaryProcessor.name);
  }

  async process(job: Job): Promise<CloudinaryUploadResult | void> {
    switch (job.name) {
      case CLOUDINARY_JOBS.UPLOAD:
        return this.handleUpload(job.data as UploadJob);
      case CLOUDINARY_JOBS.DELETE:
        return this.handleDelete(job.data as DeleteJob);
      default:
        this.logger.warn(`Unknown job type: ${job.name}`);
    }
  }

  private async handleUpload(data: UploadJob): Promise<CloudinaryUploadResult> {
    this.logger.debug('Processing upload job');

    try {
      const file = {
        ...data.file,
        buffer: Buffer.from(data.file.buffer, 'base64'),
      };
      const result = await uploadToCloudinary(file);
      this.logger.debug('Upload completed', { publicId: result.public_id });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Upload failed', err.stack);
      throw error;
    }
  }

  private async handleDelete(data: DeleteJob): Promise<void> {
    this.logger.debug('Processing delete job', { publicId: data.publicId });

    try {
      await deleteFromCloudinary(data.publicId);
      this.logger.debug('Delete completed', { publicId: data.publicId });
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Delete failed', err.stack, {
        publicId: data.publicId,
      });
      throw error;
    }
  }
}
