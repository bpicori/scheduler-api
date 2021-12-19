import { Injectable } from '@nestjs/common';
import { ICommand } from '../../types/command';
import { CacheService } from './cache.service';
import IoRedis, { Redis } from 'ioredis';
import { ConfigService } from '../config.service';

@Injectable()
export class RedisCacheService implements CacheService {
  private redis?: Redis;

  public constructor(private config: ConfigService) {
    this.redis = new IoRedis(this.config.redisUri);
  }

  public async get(key: number): Promise<ICommand[] | undefined> {
    return this.redis?.smembers(key.toString()).then((res) => {
      if (res && res.length === 0) {
        return undefined;
      }
      return res.map<ICommand>((item) => {
        const [id, url, status] = JSON.parse(item);
        return { id, url, time: key, status };
      });
    });
  }

  public async set(key: number, value: ICommand): Promise<void> {
    await this.redis?.sadd(
      key.toString(),
      JSON.stringify([value.id, value.url, value.status]),
    );
  }

  public async delete(key: number): Promise<void> {
    await this.redis?.del(key.toString());
  }

  public async ping(): Promise<void> {
    await this.redis?.ping();
  }
}
