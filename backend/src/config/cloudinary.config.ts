import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';

type CloudinaryResult = {
  url: string;
  public_id: string;
};
const DEFAULT_FOLDER = 'MyPortofolio/Avatar';

export const uploadToCloudinary = async (
  file: Express.Multer.File,
  options?: UploadApiOptions,
): Promise<CloudinaryResult> => {
  if (!file) {
    throw new BadRequestException('File is required');
  }

  if (!file.buffer) {
    throw new BadRequestException('Invalid file buffer');
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: DEFAULT_FOLDER,
        resource_type: 'image',
        public_id: `profile_${Date.now()}`,
        ...options,
      },
      (error, result) => {
        if (error) {
          return reject(
            new InternalServerErrorException(
              'Failed to upload image to Cloudinary',
            ),
          );
        }

        if (!result) {
          return reject(
            new InternalServerErrorException('No result from Cloudinary'),
          );
        }

        resolve({ url: result.secure_url, public_id: result.public_id });
      },
    );

    stream.end(file.buffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  if (!publicId) {
    throw new BadRequestException('Public ID is required');
  }

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    throw new InternalServerErrorException(
      'Failed to delete image from Cloudinary',
    );
  }
};

export default cloudinary;
