import EventEmitter from 'events';
import express from 'express';

export class Webhook extends EventEmitter {
  constructor(private port: number) {
    super();
  }

  public async start() {
    const app = express();
    app.post('/:id', (req, res) => {
      const id = req.params.id;
      this.emit(id, { ok: true });
      res.send('ok');
    });

    app.listen(this.port, () => {
      console.log(`Webhook server is running http://localhost:${this.port}`);
    });
  }

  public waitFor(id: number, timeout: number) {
    return new Promise((resolve, reject) => {
      this.once(id.toString(), (data) => {
        resolve(data);
      });
      setTimeout(() => {
        reject(new Error('Timeout'));
      }, timeout * 1000);
    });
  }
}
