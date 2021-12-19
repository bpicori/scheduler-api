import { ICommand } from '../../types/command';

export abstract class CacheService {
  abstract get(
    key: number,
  ): ICommand[] | undefined | Promise<ICommand[] | undefined>;
  abstract set(key: number, command: ICommand): void | Promise<void>;
  abstract delete(key: number): void | Promise<void>;
  abstract ping(): void | Promise<void>;
}
