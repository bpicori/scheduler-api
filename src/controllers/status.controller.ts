import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '../services/config.service';

@Controller('status')
export class StatusController {
  public constructor(private configService: ConfigService) {}

  @Get()
  public async status() {
    return 'ok';
  }
}
