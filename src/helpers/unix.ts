/**
 * Return the unix timestamp of the current time.
 */
export function unix(): number {
  return Math.floor(Date.now() / 1000);
}
