"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export {
  FREQUENCY_OPTIONS,
  cronToFrequency,
  frequencyToCron,
} from "@/lib/cron-utils";
export type { FrequencyOption } from "@/lib/cron-utils";
import { FREQUENCY_OPTIONS } from "@/lib/cron-utils";

interface FrequencySelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export function FrequencySelector({
  value,
  onValueChange,
}: FrequencySelectorProps) {
  return (
    <Select
      value={value || FREQUENCY_OPTIONS[0].label}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select frequency" />
      </SelectTrigger>
      <SelectContent>
        {FREQUENCY_OPTIONS.map((option) => (
          <SelectItem key={option.label} value={option.label}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
