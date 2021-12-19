import { ICommand } from '../../../src/types/command';
import { config, db } from '../before';

export async function insert(command: Omit<ICommand, 'id'>): Promise<number> {
  const res = await db.query(
    `INSERT INTO ${config.postgres.table} (time, url, status) VALUES ($1, $2, $3) returning id`,
    [command.time, command.url, command.status],
  );
  return res.rows[0].id;
}
