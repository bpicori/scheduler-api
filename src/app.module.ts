import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TimerController } from './timer/timer.controller';
import { TimerService } from './timer/timer.service';
import { CronService } from './cron.service';
import { StorageCacheService } from './storage/storage-cache.service';
import { StorageService } from './storage/storage.service';
import { PostgresStorageService } from './storage/postgres-storage.service';
import { ConfigService } from './config.service';
import { unix } from './helpers';
import { ExecutorService } from './executor.service';

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
  ],
})
export class AppModule implements OnModuleInit {
  public constructor(
    private storage: StorageService,
    private cache: StorageCacheService,
    private executor: ExecutorService,
    private cron: CronService,
  ) {}
  public async onModuleInit() {
    const all = await this.storage.getAllStatusPending();
    this.cron.start();
    this.cron.subscribeSecond(() => {
      this.executor.executeCycle();
    });
    const now = unix();
    all.forEach((command) => {
      if (command.time <= now) {
        this.executor.execute(command);
      } else {
        this.cache.set(command.time, command);
      }
    });
    console.log(all);
  }
}
