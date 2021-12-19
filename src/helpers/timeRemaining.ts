import { unix } from './unix';

/**
 * Returns the time remaining in seconds. If the time is over, returns 0.
 * @returns {number}
 * @param time
 */
export function timeRemaining(time: number) {
  const now = unix();
  return time - now > 0 ? time - now : 0;
}
