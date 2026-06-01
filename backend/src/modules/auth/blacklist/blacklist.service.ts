import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class BlacklistService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async blacklist(token: string, ttl: number): Promise<void> {
    await this.cache.set(`blacklist:${token}`, true, ttl * 1000);
  }

  async isBlacklist(token: string): Promise<boolean> {
    const result = await this.cache.get(`blacklist:${token}`);
    return result != null;
  }
}
// TODO improve naming method
// TODO seperate key generation to constans folder
// TODO change the way store JWT token and hash it before stored
// TODO add try catch for error handling when redis countering error
// EXPLANATION for token that can't stored directly it is causing memory waste, inefficient, and security reasons. It's also effect to application performance
