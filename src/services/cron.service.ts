import { Injectable, Logger } from '@nestjs/common';
import { unix } from '../helpers/unix';

@Injectable()
export class CronService {
  constructor(private logger: Logger) {}

  private secondSubscribers: Array<() => void> = [];
  private minuteSubscribers: Array<() => void> = [];
  private intervalPointer: NodeJS.Timer | undefined;

  public start() {
    this.logger.debug('CronService started');
    if (this.intervalPointer) {
      clearInterval(this.intervalPointer);
    }
    this.intervalPointer = setInterval(() => {
      const now = unix();
      if (now % 60 === 0) {
        this.minuteSubscribers.forEach((handler) => handler());
      }
      this.secondSubscribers.forEach((handler) => handler());
    }, 1000);
  }

  public stop() {
    this.logger.debug('CronService stopped');
    if (this.intervalPointer) {
      clearInterval(this.intervalPointer);
      this.logger.debug('CronService stopped');
    }
  }

  subscribeSecond(handler: () => void) {
    if (!this.secondSubscribers.includes(handler)) {
      this.secondSubscribers.push(handler);
    }
  }

  subscribeMinute(handler: () => void) {
    if (!this.minuteSubscribers.includes(handler)) {
      this.minuteSubscribers.push(handler);
    }
  }
}
