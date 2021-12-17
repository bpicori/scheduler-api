import { Injectable } from '@nestjs/common';
import { TimerDto } from './timer.dto';

@Injectable()
export class TimerService {
  public async find(id: string) {
    return id;
  }

  public insert(timer: TimerDto) {
    console.log(timer);
    return '';
  }
}
