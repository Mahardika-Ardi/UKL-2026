import { Request } from 'express';
import { Role } from 'generated/prisma/enums';

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        email: string;
        phone: string;
        role: Role;
      };
    }
  }
}
