import { HttpException, Injectable } from '@nestjs/common';
import { TimerDto } from './timer.dto';
import {
  CommandStatus,
  StorageCacheService,
} from '../storage/storage-cache.service';
import { convertTimerToUnix, unix } from '../helpers';
import { v4 as uuid } from 'uuid';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class TimerService {
  public constructor(
    private storageCache: StorageCacheService,
    private storage: StorageService,
  ) {}

  public async find(id: string): Promise<number> {
    const timer = await this.storageCache.getById(id);
    if (!timer) {
      throw new HttpException('Timer not found', 400);
    }
    const now = unix();
    return timer.time - now > 0 ? timer.time - now : 0;
  }

  public async insert(timer: TimerDto): Promise<{ id: string }> {
    const time = convertTimerToUnix({
      hours: timer.hours,
      minutes: timer.minutes,
      seconds: timer.seconds,
    });
    const id = uuid();
    this.storageCache.set(time, {
      url: timer.url,
      id,
      time,
      status: CommandStatus.Pending,
    });
    await this.storage.insert({
      id,
      time,
      status: CommandStatus.Pending,
      url: timer.url,
    });
    return { id };
  }
}
