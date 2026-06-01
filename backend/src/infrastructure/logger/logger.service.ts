import {
  Injectable,
  LoggerService as NestLoggerService,
  Optional,
} from '@nestjs/common';
import {
  combinedFileTransport,
  consoleTransport,
  errorFileTransport,
} from 'src/config/logger.config';
import { createLogger, Logger } from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: Logger;

  constructor(@Optional() private context?: string) {
    this.logger = createLogger({
      level: process.env.LOG_LEVEL || 'debug',
      defaultMeta: {
        service: process.env.APP_NAME || 'nest-app',
        environment: process.env.NODE_ENV || 'development',
      },
      transports: [consoleTransport, combinedFileTransport, errorFileTransport],
    });
  }

  private resolveArgs(meta?: unknown): {
    context: string | undefined;
    data: Record<string, unknown>;
  } {
    if (typeof meta === 'string') {
      return { context: meta, data: {} };
    }

    if (typeof meta === 'object' && meta !== null) {
      return { context: this.context, data: meta as Record<string, unknown> };
    }

    return { context: this.context, data: {} };
  }

  setContext(context: string): LoggerService {
    return new LoggerService(context);
  }

  log(message: string, meta?: unknown): void {
    const { context, data } = this.resolveArgs(meta);
    this.logger.info(message, { context: context, ...data });
  }

  error(message: string, trace?: unknown, meta?: unknown): void {
    const stack = typeof trace === 'string' ? trace : undefined;
    const { context, data } = this.resolveArgs(
      typeof trace === 'object' ? trace : meta,
    );
    this.logger.error(message, { context, stack, ...data });
  }

  warn(message: string, meta?: unknown): void {
    const { context, data } = this.resolveArgs(meta);
    this.logger.warn(message, { context: context, ...data });
  }

  debug(message: string, meta?: unknown): void {
    const { context, data } = this.resolveArgs(meta);
    this.logger.debug(message, { context: context, ...data });
  }

  verbose(message: string, meta?: unknown): void {
    const { context, data } = this.resolveArgs(meta);
    this.logger.verbose(message, { context: context, ...data });
  }
}
