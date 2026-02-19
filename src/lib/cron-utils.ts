export interface FrequencyOption {
  label: string;
  cronExpression: string;
}

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { label: "Daily", cronExpression: "0 8 * * *" },
  { label: "Weekdays", cronExpression: "0 8 * * 1-5" },
  { label: "Weekends", cronExpression: "0 8 * * 0,6" },
];

export function frequencyToCron(frequency: string): string {
  const option = FREQUENCY_OPTIONS.find((opt) => opt.label === frequency);
  return option?.cronExpression || FREQUENCY_OPTIONS[0].cronExpression;
}

export function cronToFrequency(cronExpression: string): string {
  const option = FREQUENCY_OPTIONS.find(
    (opt) => opt.cronExpression === cronExpression,
  );
  return option?.label || FREQUENCY_OPTIONS[0].label;
}

/**
 * Replace the hour field in a cron expression with a new hour value.
 * e.g. mergeHourIntoCron("0 9 * * 1-5", 14) → "0 14 * * 1-5"
 */
export function mergeHourIntoCron(cronExpression: string, hour: number): string {
  const parts = cronExpression.split(" ");
  parts[1] = String(hour);
  return parts.join(" ");
}

/**
 * Build a cron expression from a frequency label (or fixed cron base) and an hour.
 * If `frequency` contains a space it's treated as a cron base expression directly;
 * otherwise it's treated as a frequency label and converted first.
 */
export function buildCronExpression(frequency: string, sendTime: number): string {
  const cronBase = frequency.includes(" ")
    ? frequency
    : frequencyToCron(frequency);
  return mergeHourIntoCron(cronBase, sendTime);
}
