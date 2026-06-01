import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Role } from 'generated/prisma/enums';
import { PUBLIC_KEY } from 'src/shared/decorators/public.decorator';
import { ROLE_KEY } from 'src/shared/decorators/role.decorator';

type UserPayload = {
  id: string;
  emai: string;
  phone: string;
  role: Role;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as UserPayload;

    if (!user) {
      throw new UnauthorizedException();
    }
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );
    }

    return true;
  }
}
