export class Timer {
  private seconds = 0;
  private secondSubscribers: Array<() => void> = [];
  private minuteSubscribers: Array<() => void> = [];
  private intervalPointer: NodeJS.Timer;

  constructor() {
    this.seconds = new Date().getSeconds();
  }

  start() {
    if (this.intervalPointer) {
      clearInterval(this.intervalPointer);
    }
    this.intervalPointer = setInterval(() => {
      if (this.seconds === 60) {
        this.seconds = 0;
        this.minuteSubscribers.forEach((handler) => handler());
      } else {
        this.seconds++;
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
