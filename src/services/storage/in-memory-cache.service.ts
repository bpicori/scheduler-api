import { Injectable } from '@nestjs/common';
import { WebHook } from '../../types/webhook';
import { CacheService } from './cache.service';

@Injectable()
export class InMemoryCacheService implements CacheService {
  private map: Map<number, WebHook[]>;

  public constructor() {
    this.map = new Map();
  }

  public get(key: number): WebHook[] | undefined {
    return this.map.get(key);
  }

  public set(key: number, value: WebHook): void {
    const val = this.map.get(key);
    const exists = val && val.find((v) => v.id === value.id);
    if (!exists) {
      if (val) {
        val.push(value);
        this.map.set(key, val);
      } else {
        this.map.set(key, [value]);
      }
    }
  }

  public delete(key: number): void {
    this.map.delete(key);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public ping(): void {}
}
