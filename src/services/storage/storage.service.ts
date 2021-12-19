import { OnModuleInit } from '@nestjs/common';
import { WebHook } from '../../types/webhook';
import { Status } from '../../types/status';

export abstract class StorageService implements OnModuleInit {
  abstract init(): Promise<void>;
  abstract get(id: number): Promise<WebHook | null>;
  abstract insert(command: Omit<WebHook, 'id'>): Promise<number>;
  abstract getAllStatusPending(): Promise<WebHook[]>;
  abstract updateStatus(id: number, status: Status): Promise<void>;
  abstract ping(): Promise<void>;

  public async onModuleInit(): Promise<void> {
    await this.init();
  }
}
