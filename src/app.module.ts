import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TimerController } from './timer/timer.controller';
import { TimerService } from './timer/timer.service';
import { CronService } from './cron.service';
import { StorageCacheService } from './storage/storage-cache.service';
import { StorageService } from './storage/storage.service';
import { PostgresStorageService } from './storage/postgres-storage.service';
import { ConfigService } from './config.service';
import { ExecutorService } from './executor.service';
import { ElectionService } from './election.service';

@Module({
  imports: [HttpModule],
  controllers: [TimerController],
  providers: [
    ConfigService,
    Logger,
    {
      provide: StorageService,
      inject: [ConfigService, Logger],
      useFactory: (config: ConfigService, logger: Logger) => {
        if (config.storage === 'postgres') {
          return new PostgresStorageService(config.postgres, logger);
        } else {
          throw new Error('Unknown storage');
        }
      },
    },
    TimerService,
    StorageCacheService,
    CronService,
    ExecutorService,
    ElectionService,
  ],
})
export class AppModule implements OnModuleInit {
  public constructor(private electionService: ElectionService) {}
  public async onModuleInit(): Promise<any> {
    console.log('Started election', ElectionService.name);
    this.electionService.init();
  }
}
