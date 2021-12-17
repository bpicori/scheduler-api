import { Client } from 'pg';
import { StorageService } from './storage.service';
import { PostgresStorageConfig } from '../config.service';
import { Logger } from '@nestjs/common';
import { ICommand } from '../types/command';
import { CommandStatus } from '../types/command-status';

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

  public async get(id: string): Promise<ICommand | null> {
    if (!this.client) {
      console.log('app module init');
      throw new Error('Postgres connection is not initialized');
    }
    const res = await this.client.query<ICommand>(
      `SELECT * FROM ${this.config.table} where id = $1`,
      [id],
    );
    return res.rows[0];
  }

  public async insert(command: ICommand): Promise<void> {
    if (!this.client) {
      throw new Error('Postgres connection is not initialized');
    }
    await this.client.query(
      `INSERT INTO ${this.config.table} (id, time, url, status) VALUES ($1, $2, $3, $4)`,
      [command.id, command.time, command.url, command.status],
    );
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

  public async updateStatus(id: string, status: CommandStatus): Promise<void> {
    if (!this.client) {
      throw new Error('Postgres connection is not initialized');
    }
    await this.client.query(
      `UPDATE ${this.config.table} SET status = $1 WHERE id = $2`,
      [status, id],
    );
  }
}
