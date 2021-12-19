import { unix } from './unix';

export function timeRemaining(time: number) {
  const now = unix();
  return time - now > 0 ? time - now : 0;
}
