import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@ApiTags('Health')
@SkipThrottle()
@Controller({
  path: 'health',
  version: VERSION_NEUTRAL,
})
export class HealthController {
  private readonly logger: LoggerService;

  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.setContext(HealthController.name);
  }

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Cek status kesehatan layanan dan database' })
  @ApiResponse({ status: 200, description: 'Service dalam kondisi sehat' })
  async check() {
    try {
      return await this.health.check([
        () => this.prismaHealth.pingCheck('database', this.prisma),
      ]);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Database health check failed', err.stack);
      throw error;
    }
  }
}
