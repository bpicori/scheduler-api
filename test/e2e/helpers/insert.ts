import { WebHook } from '../../../src/types/webhook';
import { config, db } from '../before';

export async function insert(command: Omit<WebHook, 'id'>): Promise<number> {
  const res = await db.query(
    `INSERT INTO ${config.postgres.table} (time, url, status) VALUES ($1, $2, $3) returning id`,
    [command.time, command.url, command.status],
  );
  return res.rows[0].id;
}
