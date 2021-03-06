import { Client } from 'pg';
import { ConfigService } from '../../src/services/config.service';
import fs from 'fs';
import { spawnBackendServer } from './helpers/process';
import child_process from 'child_process';
import supertest from 'supertest';
import { Webhook } from './helpers/webhook';

export let processes: Array<child_process.ChildProcess>;
export let SuperTest: supertest.SuperTest<supertest.Test>;
export const webHook = new Webhook(3001);
export let db: Client;
export let config: ConfigService;

async function initDatabase() {
  console.log('Init Database');
  db = new Client(config.postgres);
  await db.connect();
  await db.query(
    fs
      .readFileSync(__dirname + '/../../scripts/postgres/timer.sql', 'utf8')
      .toString(),
  );
}

async function initBackend(): Promise<void> {
  console.log('Init Backend');
  process.on('exit', () => {
    processes.forEach((p) => p.send('FINISH'));
  });
  processes = await spawnBackendServer(true);
}

before(async () => {
  console.log('before');
  config = new ConfigService();
  await webHook.start();
  await initDatabase();
  await initBackend();
  SuperTest = supertest(config.getFromPath('e2e.api_url'));
});
