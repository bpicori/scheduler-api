import { Status } from './status';

export interface WebHook {
  id: number;
  url: string;
  time: number;
  status: Status;
}
