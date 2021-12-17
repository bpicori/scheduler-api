export function unix(): number {
  return Math.floor(Date.now() / 1000);
}
export function convertTimerToUnix({
  hours,
  minutes,
  seconds,
}: {
  hours: number;
  minutes: number;
  seconds: number;
}): number {
  const now = unix();
  return now + (hours * 3600 + minutes * 60 + seconds);
}
