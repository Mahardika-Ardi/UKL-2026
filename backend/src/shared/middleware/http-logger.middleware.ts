import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggerService } from 'src/infrastructure/logger/logger.service';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}
  use(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();
    const { method, originalUrl, ip } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;

      const logMeta = {
        method,
        url: originalUrl,
        statusCode,
        duration: `${duration}ms`,
        ip,
        userAgent: req.get('user-agent'),
      };

      if (originalUrl === '/favicon.ico') return;

      if (statusCode >= 500) {
        this.logger.error(
          `${method} ${originalUrl} ${statusCode}`,
          undefined,
          logMeta,
        );
      } else if (statusCode >= 400) {
        this.logger.warn(`${method} ${originalUrl} ${statusCode}`, logMeta);
      } else {
        this.logger.log(`${method} ${originalUrl} ${statusCode}`, logMeta);
      }
    });

    next();
  }
}
