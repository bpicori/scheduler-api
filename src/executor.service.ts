import { HttpService } from '@nestjs/axios';
import { unix } from './helpers';
import { Injectable, Logger } from '@nestjs/common';
import { StorageService } from './storage/storage.service';
import { lastValueFrom } from 'rxjs';
import { CommandStatus } from './types/command-status';
import { ICommand } from './types/command';
import { CacheService } from './storage/cache.service';

@Injectable()
export class ExecutorService {
  public constructor(
    private cache: CacheService,
    private storage: StorageService,
    private httpService: HttpService,
    private logger: Logger,
  ) {}

  public async executeCycle() {
    const now = unix();
    const commands = await this.cache.get(now);
    if (commands && commands.length) {
      commands.forEach(async (command) => {
        await this.execute(command);
        this.logger.debug(
          `Command :${command.id} executed`,
          ExecutorService.name,
        );
      });
      this.cache.delete(now);
      this.logger.debug(
        `Executed cycle finished executing ${commands.length} commands`,
        ExecutorService.name,
      );
    }
  }

  public async sync() {
    const all = await this.storage.getAllStatusPending();
    const now = unix();
    all.forEach((command) => {
      if (command.time <= now) {
        this.execute(command);
      } else {
        this.cache.set(command.time, command);
      }
    });
    this.logger.debug(
      `Executed sync, finished executing ${all.length} commands`,
      ExecutorService.name,
    );
  }

  public async execute(command: ICommand): Promise<void> {
    this.logger.debug(`Request to url: ${command.url}`, ExecutorService.name);
    try {
      await lastValueFrom(this.httpService.get(`${command.url}/${command.id}`));
      this.logger.debug(
        `Webhook: ${command.url} executed successfully`,
        ExecutorService.name,
      );
      await this.storage.updateStatus(command.id, CommandStatus.Success);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Webhook: ${command.url} failed with error: ${error.message}`,
          ExecutorService.name,
        );
      } else {
        this.logger.error(
          `Webhook: ${command.url} failed with unknown error`,
          ExecutorService.name,
        );
      }
      await this.storage.updateStatus(command.id, CommandStatus.Failed);
    }
  }
}
