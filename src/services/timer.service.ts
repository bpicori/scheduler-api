import { HttpException, Injectable } from '@nestjs/common';
import { TimerDto } from '../types/timer.dto';
import { v4 as uuid } from 'uuid';
import { StorageService } from '../storage/storage.service';
import { CommandStatus } from '../types/command-status';
import { CacheService } from '../storage/cache.service';
import { convertTimerToUnix } from '../helpers/convertTimerToUnix';
import { timeRemaining } from '../helpers/timeRemaining';

@Injectable()
export class TimerService {
  public constructor(
    private cache: CacheService,
    private storage: StorageService,
  ) {}

  public async find(id: string): Promise<{ id: string; time_left: number }> {
    const timer = await this.storage.get(id);
    if (!timer) {
      throw new HttpException('Timer not found', 400);
    }
    return {
      id,
      time_left: timeRemaining(timer.time),
    };
  }

  public async insert(timer: TimerDto): Promise<{ id: string }> {
    const time = convertTimerToUnix({
      hours: timer.hours,
      minutes: timer.minutes,
      seconds: timer.seconds,
    });
    const id = uuid();
    // TODO id numeric from database
    // TODO url parse to get hostname and pathname and attach id to pathname

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
