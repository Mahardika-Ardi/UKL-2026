export const PrismaClient = jest.fn().mockImplementation(() => ({}));

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export const Prisma = {
  PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
    code: string;
    constructor(message: string, { code }: { code: string }) {
      super(message);
      this.code = code;
    }
  },
};
