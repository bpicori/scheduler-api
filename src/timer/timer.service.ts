import { HttpException, Injectable } from '@nestjs/common';
import { TimerDto } from './timer.dto';
import { v4 as uuid } from 'uuid';
import { StorageService } from '../storage/storage.service';
import { CommandStatus } from '../types/command-status';
import { CacheService } from '../storage/cache.service';
import { unix } from '../helpers/unix';
import { convertTimerToUnix } from '../helpers/convertTimerToUnix';

@Injectable()
export class TimerService {
  public constructor(
    private cache: CacheService,
    private storage: StorageService,
  ) {}

  public async find(id: string): Promise<number> {
    const timer = await this.storage.get(id);
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
    // set to cache
    await this.cache.set(time, {
      url: timer.url,
      id,
      time,
      status: CommandStatus.Pending,
    });
    // save to db
    await this.storage.insert({
      id,
      time,
      status: CommandStatus.Pending,
      url: timer.url,
    });
    return { id };
  }
}
