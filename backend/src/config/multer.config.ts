import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { memoryStorage } from 'multer';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const fileFilter: MulterOptions['fileFilter'] = (
  req: Request,
  file,
  callback,
) => {
  const isValidMime = ALLOWED_MIME_TYPES.includes(
    file.mimetype as AllowedMimeType,
  );
  const ext = file.originalname.split('.').pop()?.toLowerCase();
  const allowedExt = ['jpg', 'jpeg', 'png', 'webp'];
  const isValidExt = ext && allowedExt.includes(ext);

  if (!isValidMime || !isValidExt) {
    return callback(
      new BadRequestException('Invalid file type. Only JPG, PNG, WEBP allowed'),
      false,
    );
  }

  callback(null, true);
};

export const multerConfig: MulterOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
};
