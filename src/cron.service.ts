import { Injectable, OnModuleInit, Scope } from '@nestjs/common';
import { unix } from './helpers';

@Injectable({ scope: Scope.DEFAULT })
export class CronService implements OnModuleInit {
  onModuleInit() {
    this.start();
  }

  private secondSubscribers: Array<() => void> = [];
  private minuteSubscribers: Array<() => void> = [];
  private intervalPointer: NodeJS.Timer | undefined;

  start() {
    if (this.intervalPointer) {
      clearInterval(this.intervalPointer);
    }
    this.intervalPointer = setInterval(() => {
      const now = unix();
      if (now % 60 === 0) {
        this.minuteSubscribers.forEach((handler) => handler());
      } else {
      }
      this.secondSubscribers.forEach((handler) => handler());
    }, 1000);
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
