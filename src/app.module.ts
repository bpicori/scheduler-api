import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TimerController } from './controllers/timer.controller';
import { TimerService } from './services/timer.service';
import { CronService } from './services/cron.service';
import { InMemoryCacheService } from './storage/in-memory-cache.service';
import { StorageService } from './storage/storage.service';
import { PostgresStorageService } from './storage/postgres-storage.service';
import { ConfigService } from './services/config.service';
import { ExecutorService } from './services/executor.service';
import { ElectionService } from './services/election.service';
import { CacheService } from './storage/cache.service';
import { RedisCacheService } from './storage/redis-cache.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { StatusController } from './controllers/status.controller';

@Module({
  imports: [HttpModule],
  controllers: [TimerController, StatusController],
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
      useFactory: (config: ConfigService) => {
        if (config.replicated) {
          return new RedisCacheService(config);
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
export class AppModule implements OnModuleInit, NestModule {
  public constructor(
    private electionService: ElectionService,
    private config: ConfigService,
    private cronService: CronService,
    private executorService: ExecutorService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }

  public async onModuleInit(): Promise<any> {
    if (this.config.replicated) {
      this.electionService.init();
    } else {
      this.cronService.start();
      this.cronService.subscribeSecond(() => {
        this.executorService.executeCycle();
      });
      this.cronService.subscribeMinute(() => {
        this.executorService.sync();
      });
    }
  }
}
