import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type CustomDatePickerProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  className?: string;
};

// Safe date string parsing in local timezone
const parseLocalDate = (dateStr: string): Date | undefined => {
  if (!dateStr) return undefined;
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return undefined;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
};

// Safe formatting of local Date into YYYY-MM-DD
const toLocalDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export function CustomDatePicker({
  id,
  value,
  onChange,
  min,
  max,
  placeholder = "Select Date",
  className,
}: CustomDatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(() => parseLocalDate(value));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setDate(parseLocalDate(value));
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      onChange(toLocalDateString(selectedDate));
      setOpen(false);
    }
  };

  const formattedLabel = date
    ? date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : placeholder;

  const minDate = min ? parseLocalDate(min) : new Date(1900, 0, 1);
  const maxDate = max ? parseLocalDate(max) : new Date();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            "mt-1.5 w-full rounded-xl border border-border bg-[oklch(1_0_0/0.04)] px-3 py-2.5 text-sm text-left text-ivory outline-none transition-colors hover:bg-[oklch(1_0_0/0.06)] focus:border-[var(--gold)]/60 focus-visible:ring-2 focus-visible:ring-[var(--gold)]/30 flex items-center justify-between cursor-pointer",
            !date && "text-muted-foreground",
            className,
          )}
        >
          <span>{formattedLabel}</span>
          <CalendarIcon className="h-4 w-4 text-gold/70" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 border border-border/80 bg-popover/95 backdrop-blur-md"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          captionLayout="dropdown"
          startMonth={minDate}
          endMonth={maxDate}
          disabled={(d) => {
            if (minDate && d < minDate) return true;
            if (maxDate && d > maxDate) return true;
            return false;
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
