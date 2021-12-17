import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TimerService } from './timer.service';
import { TimerDto } from './timer.dto';

@Controller('timers')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Get(':id')
  async find(@Param('id') id: string): Promise<string> {
    return this.timerService.find(id);
  }

  @Post()
  async insert(@Body() timer: TimerDto): Promise<string> {
    return this.timerService.insert(timer);
  }
}
