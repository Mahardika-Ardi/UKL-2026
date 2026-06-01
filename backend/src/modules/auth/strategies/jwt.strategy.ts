import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Role } from 'generated/prisma/enums';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { BlacklistService } from 'src/modules/auth/blacklist/blacklist.service';

type Payload = {
  id: string;
  email: string;
  phone: string;
  role: Role;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly blacklist: BlacklistService,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => (req?.cookies?.['access_token'] as string) ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('jwt.key'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: Payload) {
    const token = req.cookies['access_token'] as string;

    const blacklisted = await this.blacklist.isBlacklist(token);

    if (blacklisted) {
      throw new UnauthorizedException('Token has been revoked');
    }

    return payload;
  }
}
