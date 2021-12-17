import { IsInt, IsUrl, IsUUID, Matches, Max, Min } from 'class-validator';

///{hours: 4, minutes: 0, seconds: 1, url: "https://someserver.com"}
export class TimerDto {
  @IsInt({ message: 'Hours must be an integer' })
  @Min(0, {
    message: 'hours should be from 0-23, but actual is $value',
  })
  @Max(23, {
    message: 'hours should be from 0-23, but actual is $value',
  })
  readonly hours!: number;

  @IsInt({ message: 'Minutes must be an integer' })
  @Min(0, {
    message: 'minutes should be from 0-59, but actual is $value',
  })
  @Max(59, {
    message: 'minutes should be from 0-59, but actual is $value',
  })
  readonly minutes!: number;

  @IsInt({ message: 'Seconds must be an integer' })
  @Min(0, {
    message: 'seconds should be from 0-59, but actual is $value',
  })
  @Max(59, {
    message: 'seconds should be from 0-59, but actual is $value',
  })
  readonly seconds!: number;

  @IsUrl()
  readonly url!: string;
}

export class UUID {
  @IsUUID('4')
  readonly id!: string;
}
