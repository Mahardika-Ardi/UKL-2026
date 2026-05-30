import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from 'generated/prisma/client';

import { prismaErrors } from '../utils/prisma-error.utils';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
// import { AppError } from '../utils/app-error.utils';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      this.logger.warn(`${status} ${request.method} ${request.url}`, {
        context: GlobalExceptionFilter.name,
      });

      response.status(status).json(body);
      return;
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      this.logger.error(
        `Prisma [${exception.code}] ${request.method} ${request.url}`,
        exception.stack,
        { context: GlobalExceptionFilter.name, code: exception.code },
      );

      try {
        await prismaErrors(exception);
      } catch (httpError: unknown) {
        if (httpError instanceof HttpException) {
          response.status(httpError.getStatus());
          // .json(httpError.getResponse() as Record<string, unknown>);
          return;
        }

        // const fallback = AppError.internal();
        response.status(HttpStatus.INTERNAL_SERVER_ERROR);
        //   .json(fallback.getResponse() as Record<string, unknown>);
      }

      const err =
        exception instanceof Error ? exception : new Error(String(exception));

      this.logger.error(
        `Unexpected error: ${request.method} ${request.url}`,
        err.stack,
        { context: GlobalExceptionFilter.name },
      );

      //   const fallback = AppError.internal();
      response.status(HttpStatus.INTERNAL_SERVER_ERROR);
      // .json(fallback.getResponse() as Record<string, unknown>);
    }
  }
}
