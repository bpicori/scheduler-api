import { Injectable } from '@nestjs/common';
import { ICommand } from '../types/command';
import { CacheService } from './cache.service';
import IoRedis, { Redis } from 'ioredis';

@Injectable()
export class RedisCacheService implements CacheService {
  private redis?: Redis;

  public constructor() {
    this.redis = new IoRedis('redis://redis:6379');
  }

  public async get(key: number): Promise<ICommand[] | undefined> {
    return this.redis?.lrange(key.toString(), 0, -1).then((res) => {
      if (res.length === 0) {
        return undefined;
      }
      return res.map((item) => JSON.parse(item)) as ICommand[];
    });
  }

  public async set(key: number, value: ICommand): Promise<void> {
    await this.redis?.lpush(key.toString(), JSON.stringify(value));
  }

  public async delete(key: number): Promise<void> {
    await this.redis?.del(key.toString());
  }
}
