import { Client } from 'pg';
import { ConfigService } from '../../src/services/config.service';
import { processes } from './before';

after(async () => {
  const config = new ConfigService();
  const client = new Client(config.postgres);
  await client.connect();
  // drop clients backends
  await client.query(`DROP table  ${config.postgres.table}`);
  processes.forEach((p) => p.send('FINISH'));
});
