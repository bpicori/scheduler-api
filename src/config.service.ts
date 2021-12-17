import { Injectable } from '@nestjs/common';
import config from 'config';

export interface PostgresStorageConfig {
  host: string;
  port: number;
  database: string;
  table: string;
  user: string;
  password: string;
}

@Injectable()
export class ConfigService {
  public get postgres(): PostgresStorageConfig {
    return config.get('postgres');
  }

  public get storage(): string {
    return config.get('storage');
  }

  public get replicated(): boolean {
    return config.get('replicated') === 'true';
  }
}
