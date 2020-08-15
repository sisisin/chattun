export function toDisplayTime(datetime: Date): string {
  return twoDigits(datetime.getHours()) + ':' + twoDigits(datetime.getMinutes());
}

function twoDigits(n: number): string {
  return ('0' + n).slice(-2);
}
