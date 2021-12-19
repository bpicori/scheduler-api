import { Injectable } from '@nestjs/common';
import { ICommand } from '../../types/command';
import { CacheService } from './cache.service';

@Injectable()
export class InMemoryCacheService implements CacheService {
  private map: Map<number, ICommand[]>;

  public constructor() {
    this.map = new Map();
  }

  public get(key: number): ICommand[] | undefined {
    return this.map.get(key);
  }

  public set(key: number, value: ICommand): void {
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
}
