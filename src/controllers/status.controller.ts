import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '../services/config.service';
import { StorageService } from '../services/storage/storage.service';
import { CacheService } from '../services/storage/cache.service';
import { ElectionService } from '../services/election.service';

@Controller('status')
export class StatusController {
  public constructor(
    private configService: ConfigService,
    private storageService: StorageService,
    private cacheService: CacheService,
    private electionService: ElectionService,
  ) {}

  /**
   * Health check status. Throw error if not healthy.
   */
  @Get()
  public async status() {
    await this.storageService.ping();
    await this.cacheService.ping();
    return {
      storage: true,
      cache: true,
      leader: this.electionService.isLeader,
    };
  }
}
