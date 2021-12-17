import { Injectable, OnModuleInit } from '@nestjs/common';
import { IStorage } from './storage/IStorage';

export enum CommandStatus {
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed',
}

export interface ICommand {
  id: string;
  url: string;
  time: number;
  status: CommandStatus;
}

@Injectable()
export class Store {
  private map: Map<number, ICommand[]>;

  public constructor(private storage: IStorage) {
    this.map = new Map();
  }

  public get(key: number): ICommand[] | undefined {
    return this.map.get(key);
  }

  public async getById(id: string): Promise<ICommand | null> {
    return this.storage.get(id);
  }

  public set(key: number, value: ICommand): void {
    const val = this.map.get(key);
    if (val) {
      val.push(value);
      this.map.set(key, val);
    } else {
      this.map.set(key, [value]);
    }
    this.storage.insert(value).catch(console.error);
  }

  public delete(key: number, commands: ICommand[]): void {
    this.map.delete(key);
    // commands.forEach();
    // this.storage.update(val.id).catch(console.error);
  }
}
