import { WebHook } from '../../types/webhook';

export abstract class CacheService {
  abstract get(
    key: number,
  ): WebHook[] | undefined | Promise<WebHook[] | undefined>;
  abstract set(key: number, command: WebHook): void | Promise<void>;
  abstract delete(key: number): void | Promise<void>;
  abstract ping(): void | Promise<void>;
}
