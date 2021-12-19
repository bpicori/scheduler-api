import { Injectable, Logger } from '@nestjs/common';
import { StorageService } from './storage/storage.service';
import { CommandStatus } from '../types/command-status';
import { ICommand } from '../types/command';
import { CacheService } from './storage/cache.service';
import { unix } from '../helpers/unix';
import axios from 'axios';
import { addIdToUrl } from '../helpers/addIdToUrl';

@Injectable()
export class ExecutorService {
  public constructor(
    private cache: CacheService,
    private storage: StorageService,
    private logger: Logger,
  ) {}

  public async executeCycle() {
    const now = unix();
    const commands = await this.cache.get(now);
    this.logger.debug('Executing cycle', ExecutorService.name);
    if (commands && commands.length) {
      commands.forEach(async (command) => {
        await this.execute(command);
        this.logger.debug(
          `Command ${command.id} executed`,
          ExecutorService.name,
        );
      });
      this.cache.delete(now);
      this.logger.debug(
        `Cycle: Finished executing ${commands.length} commands`,
        ExecutorService.name,
      );
    }
  }

  public async sync() {
    const all = await this.storage.getAllStatusPending();
    this.logger.debug('Executing sync', ExecutorService.name);
    const now = unix();
    let executed = 0;
    all.forEach((command) => {
      if (command.time <= now) {
        this.execute(command);
        executed += 1;
      } else {
        this.cache.set(command.time, command);
      }
    });
    this.logger.debug(
      `Sync: Finished executing ${executed} commands`,
      ExecutorService.name,
    );
  }

  public async execute(command: ICommand): Promise<void> {
    const url = addIdToUrl(command.url, command.id);
    try {
      await axios.post(url, {});
      this.logger.debug(
        `Webhook: ${command.url} executed successfully`,
        ExecutorService.name,
      );
      await this.storage.updateStatus(command.id, CommandStatus.Success);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Webhook: ${url} failed with error: ${error.message}`,
          ExecutorService.name,
        );
      } else {
        this.logger.error(
          `Webhook: ${url} failed with unknown error`,
          ExecutorService.name,
        );
      }
      await this.storage.updateStatus(command.id, CommandStatus.Failed);
    }
  }
}
