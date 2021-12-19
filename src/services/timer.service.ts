import { HttpException, Injectable } from '@nestjs/common';
import { TimerDto } from '../types/timer.dto';
import { StorageService } from './storage/storage.service';
import { Status } from '../types/status';
import { CacheService } from './storage/cache.service';
import { convertTimerToUnix } from '../helpers/convertTimerToUnix';
import { timeRemaining } from '../helpers/timeRemaining';

@Injectable()
export class TimerService {
  public constructor(
    private cache: CacheService,
    private storage: StorageService,
  ) {}

  public async find(id: number): Promise<{ id: number; time_left: number }> {
    const timer = await this.storage.get(id);
    if (!timer) {
      throw new HttpException('Timer not found', 404);
    }
    return {
      id,
      time_left: timeRemaining(timer.time),
    };
  }

  public async insert(timer: TimerDto): Promise<{ id: number }> {
    const time = convertTimerToUnix({
      hours: timer.hours,
      minutes: timer.minutes,
      seconds: timer.seconds,
    });
    const id = await this.storage.insert({
      time,
      status: Status.Pending,
      url: timer.url,
    });
    // set to cache
    await this.cache.set(time, {
      id,
      url: timer.url,
      time,
      status: Status.Pending,
    });
    // save to db
    return { id };
  }
}
