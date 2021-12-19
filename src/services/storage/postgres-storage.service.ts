import { Client } from 'pg';
import { StorageService } from './storage.service';
import { PostgresStorageConfig } from '../config.service';
import { Logger } from '@nestjs/common';
import { ICommand } from '../../types/command';
import { CommandStatus } from '../../types/command-status';

export class PostgresStorageService extends StorageService {
  private client: Client | null;

  public constructor(
    private config: PostgresStorageConfig,
    private logger: Logger,
  ) {
    super();
    this.client = null;
  }

  public async init(): Promise<void> {
    this.client = new Client(this.config);
    await this.client.connect();
    this.logger.log('Connection initialize', 'PostgresStorageService');
  }

  public async get(id: number): Promise<ICommand | null> {
    if (!this.client) {
      throw new Error('Postgres connection is not initialized');
    }
    const res = await this.client.query<ICommand>(
      `SELECT * FROM ${this.config.table} where id = $1`,
      [id],
    );
    return res.rows[0];
  }

  public async insert(command: ICommand): Promise<number> {
    if (!this.client) {
      throw new Error('Postgres connection is not initialized');
    }
    const res = await this.client.query(
      `INSERT INTO ${this.config.table} (time, url, status) VALUES ($1, $2, $3) returning id`,
      [command.time, command.url, command.status],
    );
    return res.rows[0].id;
  }

  public async getAllStatusPending(): Promise<ICommand[]> {
    if (!this.client) {
      throw new Error('Postgres connection is not initialized');
    }
    const res = await this.client.query<ICommand>(
      `SELECT * FROM ${this.config.table} where status = $1`,
      [CommandStatus.Pending],
    );
    return res.rows;
  }

  public async updateStatus(id: number, status: CommandStatus): Promise<void> {
    if (!this.client) {
      throw new Error('Postgres connection is not initialized');
    }
    await this.client.query(
      `UPDATE ${this.config.table} SET status = $1 WHERE id = $2`,
      [status, id],
    );
  }

  public async ping(): Promise<void> {
    if (!this.client) {
      throw new Error('Postgres connection is not initialized');
    }
    await this.client.query('SELECT 1+1');
  }
}
