import { WebHook } from '../../types/webhook';

/**
 * Cache Service interface --
 * The key is the unix timestamp of the webhook, and the value is an array of webhooks to be executed at that time
 * Used with abstract class because we can inject it easy in other services (Typescript interfaces are erased in runtime).
 */
export abstract class CacheService {
  abstract get(
    key: number,
  ): WebHook[] | undefined | Promise<WebHook[] | undefined>;

  abstract set(key: number, command: WebHook): void | Promise<void>;

  abstract delete(key: number): void | Promise<void>;

  abstract ping(): void | Promise<void>;
}
