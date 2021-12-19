import { CommandStatus } from './command-status';

export interface ICommand {
  id: number;
  url: string;
  time: number;
  status: CommandStatus;
}
