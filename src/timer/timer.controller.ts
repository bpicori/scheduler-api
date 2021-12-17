import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { TimerService } from './timer.service';
import { TimerDto, UUID } from './timer.dto';

@Controller('timers')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Get(':id')
  async find(@Param() params: UUID): Promise<number> {
    return this.timerService.find(params.id);
  }

  @Post()
  async insert(@Body() timer: TimerDto): Promise<any> {
    return this.timerService.insert(timer);
  }
}
