import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { TimerService } from '../services/timer.service';
import { TimerDto, UUID } from '../types/timer.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('timers')
@ApiTags('timers')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Get(':id')
  async find(
    @Param() params: UUID,
  ): Promise<{ id: string; time_left: number }> {
    return this.timerService.find(params.id);
  }

  @Post()
  async insert(@Body() timer: TimerDto): Promise<any> {
    if (timer.hours === 0 && timer.minutes === 0 && timer.seconds === 0) {
      throw new HttpException('You must set at least one time unit', 400);
    }
    return this.timerService.insert(timer);
  }
}
