export const MIN_BIRTH_DATE = "1900-01-01";

export const EMPTY_DATE_ERROR = "Please enter your date of birth.";
export const INVALID_DATE_ERROR = "Please enter a valid date.";
export const FUTURE_DATE_ERROR = "Date of birth cannot be in the future.";

export type BirthDateValidationResult =
  | {
      ok: true;
      year: number;
      month: number;
      day: number;
      value: string;
    }
  | {
      ok: false;
      error: string;
    };

const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function toDateInputValue(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

function toLocalDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function parseBirthDateInput(
  input: string,
  today: Date = new Date(),
): BirthDateValidationResult {
  const value = input.trim();

  if (!value) {
    return { ok: false, error: EMPTY_DATE_ERROR };
  }

  const match = DATE_INPUT_PATTERN.exec(value);
  if (!match) {
    return { ok: false, error: INVALID_DATE_ERROR };
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return { ok: false, error: INVALID_DATE_ERROR };
  }

  const minDate = new Date(1900, 0, 1);
  if (parsed < minDate) {
    return { ok: false, error: INVALID_DATE_ERROR };
  }

  if (parsed > toLocalDateOnly(today)) {
    return { ok: false, error: FUTURE_DATE_ERROR };
  }

  return { ok: true, year, month, day, value };
}
