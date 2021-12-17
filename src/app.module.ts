import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TimerController } from './timer/timer.controller';
import { TimerService } from './timer/timer.service';
import { CronService } from './cron.service';
import { InMemoryCacheService } from './storage/in-memory-cache.service';
import { StorageService } from './storage/storage.service';
import { PostgresStorageService } from './storage/postgres-storage.service';
import { ConfigService } from './config.service';
import { ExecutorService } from './executor.service';
import { ElectionService } from './election.service';
import { CacheService } from './storage/cache.service';
import { RedisCacheService } from './storage/redis-cache.service';

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
    {
      provide: CacheService,
      inject: [ConfigService, Logger],
      useFactory: (config: ConfigService, logger: Logger) => {
        if (config.replicated) {
          return new RedisCacheService();
        } else {
          return new InMemoryCacheService();
        }
      },
    },
    TimerService,
    InMemoryCacheService,
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
