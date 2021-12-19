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
  public get httpPort(): number {
    return config.get('port');
  }
  public get redisUri(): string {
    return config.get('redis');
  }

  public get postgres(): PostgresStorageConfig {
    return config.get('postgres');
  }

  public get storage(): string {
    return config.get<string>('storage');
  }

  public get replicated(): boolean {
    return config.get<string>('replicated') === 'true';
  }

  public get etcd(): string[] {
    return config.get<string>('etcd').split(',');
  }

  public getFromPath<T>(path: string): T {
    return config.get<T>(path);
  }
}
