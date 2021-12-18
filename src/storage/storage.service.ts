import { OnModuleInit } from '@nestjs/common';
import { ICommand } from '../types/command';
import { CommandStatus } from '../types/command-status';

export abstract class StorageService implements OnModuleInit {
  abstract init(): Promise<void>;
  abstract get(id: string): Promise<ICommand | null>;
  abstract insert(command: ICommand): Promise<void>;
  abstract getAllStatusPending(): Promise<ICommand[]>;
  abstract updateStatus(id: string, status: CommandStatus): Promise<void>;

  public async onModuleInit(): Promise<void> {
    await this.init();
  }
}
