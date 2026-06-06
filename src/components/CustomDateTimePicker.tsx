import { useState, useEffect } from "react";
import { CustomDatePicker } from "./CustomDatePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type CustomDateTimePickerProps = {
  id?: string;
  dateValue: string;
  onChangeDate: (value: string) => void;
  timeValue?: string; // e.g. "02:15 PM"
  onChangeTime: (value: string | undefined) => void;
  minDate?: string;
  maxDate?: string;
};

export function CustomDateTimePicker({
  id,
  dateValue,
  onChangeDate,
  timeValue,
  onChangeTime,
  minDate,
  maxDate,
}: CustomDateTimePickerProps) {
  const [knowTime, setKnowTime] = useState(!!timeValue);
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [period, setPeriod] = useState("AM");

  // Parse initial time value
  useEffect(() => {
    if (timeValue) {
      const match = /^(\d{1,2}):(\d{2})\s(AM|PM)$/.exec(timeValue);
      if (match) {
        setHour(match[1]);
        setMinute(match[2]);
        setPeriod(match[3]);
        setKnowTime(true);
      }
    } else {
      setKnowTime(false);
    }
  }, [timeValue]);

  // Update parent when selectors change
  const handleTimeChange = (newHour: string, newMin: string, newPeriod: string) => {
    setHour(newHour);
    setMinute(newMin);
    setPeriod(newPeriod);
    if (knowTime) {
      onChangeTime(`${newHour}:${newMin} ${newPeriod}`);
    }
  };

  const handleToggleKnowTime = (checked: boolean) => {
    setKnowTime(checked);
    if (checked) {
      onChangeTime(`${hour}:${minute} ${period}`);
    } else {
      onChangeTime(undefined);
    }
  };

  // Generate minutes list (step of 5 for select usability)
  const minutes = Array.from({ length: 12 }, (_, i) => {
    const val = i * 5;
    return String(val).padStart(2, "0");
  });

  // Generate hours list
  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1));

  return (
    <div className="space-y-4">
      <div>
        <Label
          htmlFor={id}
          className="block text-[10px] uppercase tracking-widest text-muted-foreground"
        >
          Date of birth
        </Label>
        <CustomDatePicker
          id={id}
          value={dateValue}
          onChange={onChangeDate}
          min={minDate}
          max={maxDate}
        />
      </div>

      <div className="flex items-center space-x-2 pt-1.5">
        <Checkbox
          id="know-birth-time"
          checked={knowTime}
          onCheckedChange={(checked) => handleToggleKnowTime(!!checked)}
          className="border-border/60 data-[state=checked]:bg-gold data-[state=checked]:text-primary-foreground focus-visible:ring-gold cursor-pointer"
        />
        <Label
          htmlFor="know-birth-time"
          className="text-xs text-muted-foreground font-sans select-none cursor-pointer"
        >
          I know my birth time (optional)
        </Label>
      </div>

      {knowTime && (
        <div className="space-y-2 animate-reveal-up duration-200">
          <Label className="block text-[10px] uppercase tracking-widest text-muted-foreground">
            Birth Time
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Select value={hour} onValueChange={(val) => handleTimeChange(val, minute, period)}>
                <SelectTrigger className="rounded-xl border border-border bg-[oklch(1_0_0/0.04)] px-3 py-2.5 h-auto text-sm text-ivory outline-none hover:bg-[oklch(1_0_0/0.06)] focus:ring-gold/30">
                  <SelectValue placeholder="Hour" />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover/95 backdrop-blur-md">
                  {hours.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={minute} onValueChange={(val) => handleTimeChange(hour, val, period)}>
                <SelectTrigger className="rounded-xl border border-border bg-[oklch(1_0_0/0.04)] px-3 py-2.5 h-auto text-sm text-ivory outline-none hover:bg-[oklch(1_0_0/0.06)] focus:ring-gold/30">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover/95 backdrop-blur-md max-h-56">
                  {minutes.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={period} onValueChange={(val) => handleTimeChange(hour, minute, val)}>
                <SelectTrigger className="rounded-xl border border-border bg-[oklch(1_0_0/0.04)] px-3 py-2.5 h-auto text-sm text-ivory outline-none hover:bg-[oklch(1_0_0/0.06)] focus:ring-gold/30">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent className="border-border bg-popover/95 backdrop-blur-md">
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
