export const VALID_MINUTES = ['1', '3', '5', '10', '15', '30', '60', '240'];

export function isValidMinute(minute: string): boolean {
  return VALID_MINUTES.includes(minute);
}