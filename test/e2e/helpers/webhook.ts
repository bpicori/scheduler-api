import EventEmitter from 'events';
import express from 'express';

export class Webhook extends EventEmitter {
  constructor(private port: number) {
    super();
  }

  public async start() {
    const app = express();
    app.get('/:id', (req, res) => {
      const url = `http://localhost:${this.port}/${req.params.id}`;
      this.emit(url, { ok: true });
      res.send('ok');
    });

    app.listen(this.port, () => {
      console.log(`Example app listening at http://localhost:${this.port}`);
    });
  }

  public waitFor(url: string, timeout: number) {
    return new Promise((resolve, reject) => {
      this.once(url, (data) => {
        resolve(data);
      });
      setTimeout(() => {
        reject(new Error('Timeout'));
      }, timeout);
    });
  }
}
