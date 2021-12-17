import { CommandStatus } from './command-status';

export interface ICommand {
  id: string;
  url: string;
  time: number;
  status: CommandStatus;
}
