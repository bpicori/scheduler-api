import { Client } from 'pg';
import { ConfigService } from '../../src/services/config.service';
import { processes } from './before';

after(async () => {
  const config = new ConfigService();
  const client = new Client(config.postgres);
  await client.connect();
  await client.query('DROP DATABASE scheduler_test_database');
  processes.forEach((p) => p.send('FINISH'));
});
