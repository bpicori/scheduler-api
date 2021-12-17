import {
  CommandStatus,
  ICommand,
  StorageCacheService,
} from './storage/storage-cache.service';
import { HttpService } from '@nestjs/axios';
import { unix } from './helpers';
import { Injectable, Logger } from '@nestjs/common';
import { StorageService } from './storage/storage.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ExecutorService {
  private loggerContext = 'ExecutorService';

  public constructor(
    private cache: StorageCacheService,
    private storage: StorageService,
    private httpService: HttpService,
    private logger: Logger,
    private executor: ExecutorService,
  ) {}

  public async executeCycle() {
    const now = unix();
    const commands = this.cache.get(now);
    if (commands && commands.length) {
      commands.forEach(async (command) => {
        await this.execute(command);
        this.logger.debug(
          `Command :${command.id} executed`,
          this.loggerContext,
        );
      });
      this.cache.delete(now);
    }
  }

  public async sync() {
    const all = await this.storage.getAllStatusPending();
    const now = unix();
    all.forEach((command) => {
      if (command.time <= now) {
        this.executor.execute(command);
      } else {
        this.cache.set(command.time, command);
      }
    });
  }

  public async execute(command: ICommand): Promise<void> {
    this.logger.debug(`Request to url: ${command.url}`, this.loggerContext);
    try {
      await lastValueFrom(this.httpService.get(`${command.url}/${command.id}`));
      this.logger.debug(
        `Webhook: ${command.url} executed successfully`,
        this.loggerContext,
      );
      await this.storage.updateStatus(command.id, CommandStatus.Success);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Webhook: ${command.url} failed with error: ${error.message}`,
          this.loggerContext,
        );
      } else {
        this.logger.error(
          `Webhook: ${command.url} failed with unknown error`,
          this.loggerContext,
        );
      }
      await this.storage.updateStatus(command.id, CommandStatus.Failed);
    }
  }
}
