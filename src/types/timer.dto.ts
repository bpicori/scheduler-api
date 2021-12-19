import { IsInt, IsUrl, IsUUID, Max, Min } from 'class-validator';

export class TimerDto {
  @IsInt({ message: 'Hours must be an integer' })
  @Min(0, {
    message: 'hours should be from 0-23',
  })
  @Max(23, {
    message: 'hours should be from 0-23',
  })
  readonly hours!: number;

  @IsInt({ message: 'Minutes must be an integer' })
  @Min(0, {
    message: 'minutes should be from 0-59',
  })
  @Max(59, {
    message: 'minutes should be from 0-59',
  })
  readonly minutes!: number;

  @IsInt({ message: 'Seconds must be an integer' })
  @Min(0, {
    message: 'seconds should be from 0-59',
  })
  @Max(59, {
    message: 'seconds should be from 0-59',
  })
  readonly seconds!: number;

  @IsUrl({ host_whitelist: ['localhost'] })
  readonly url!: string;
}

export class UUID {
  @IsUUID('4')
  readonly id!: string;
}
